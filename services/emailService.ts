import redis from "redis";
import Bull from "bull";
import { getUserNameById } from "./userService.ts";
import Follower from "../models/follower.ts";

// redis client setup
const redisClient = redis.createClient();
redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});
redisClient.connect();

// Redis keys will now be based on the postId
const getRedisKeys = (postId: number) => {
  return {
    totalFollowersKey: `totalFollowers_${postId}`,
    processedFollowersKey: `processedFollowers_${postId}`,
    failedFollowersKey: `failedFollowers_${postId}`,
  };
};

// bull setup for notification queue to use with redis
const notificationQueue = new Bull("notificationQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// notification queue process
notificationQueue.process(async (job) => {
  const { batch, postId, bloggerId } = job.data;

  const { processedFollowersKey, failedFollowersKey, totalFollowersKey } =
    getRedisKeys(postId);
  const totalFollowers = await redisClient.get(totalFollowersKey);

  console.log(
    `Processing batch of ${batch.length} followers for post ${postId}`
  );

  for (const follower of batch) {
    await new Promise(async (resolve) => {
      setTimeout(async () => {
        const isSuccess = Math.random() > 0.5;

        if (isSuccess) {
          console.log(
            `Email sent to follower ${follower.id} for post ${postId}`
          );
          await redisClient.incr(processedFollowersKey);
        } else {
          console.log(
            `Failed to send email to follower ${follower.id} for post ${postId}`
          );
          await redisClient.incr(failedFollowersKey);

          failedNotificationQueue.add(
            { followerId: follower.id, postId, bloggerId },
            {
              attempts: 3,
              backoff: { type: "fixed", delay: 5000 },
            }
          );
        }
        resolve(undefined);
      }, 5000);
    });
  }

  const processedFollowers = await redisClient.get(processedFollowersKey);
  const failedFollowers = await redisClient.get(failedFollowersKey);

  const totalCompleted =
    (parseInt(processedFollowers!) || 0) + (parseInt(failedFollowers!) || 0);

  if (totalCompleted >= parseInt(totalFollowers!)) {
    notifyAuthor(
      bloggerId,
      postId,
      totalFollowers!,
      processedFollowers!,
      failedFollowers!
    );
    setExpirationOnCompletion(postId);
  }

  return Promise.resolve();
});

// bull setup for failed notification queue
const failedNotificationQueue = new Bull("failedNotificationQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// failed notification queue process
failedNotificationQueue.process(async (job) => {
  const { followerId, postId } = job.data;

  console.log(
    `Retrying email for failed follower ${followerId} for post ${postId}`
  );

  try {
    const isSuccess = true;

    if (isSuccess) {
      console.log(
        `Successfully sent email to follower ${followerId} on retry for post ${postId}`
      );
    } else {
      throw new Error(`Failed to send email to follower ${followerId} again`);
    }
  } catch (err) {
    console.error(
      `Error processing follower ${followerId} for post ${postId}:`,
      err
    );
    throw err;
  }
});

//Helper function to notify the author
const notifyAuthor = async (
  bloggerId: number,
  postId: number,
  totalFollowers: string,
  processedFollowers: string,
  failedFollowers: string
) => {
  const successfullyNotified = processedFollowers || 0;
  const failedToNotify = failedFollowers || 0;

  const authorName = await getUserNameById(bloggerId);

  console.log(`\n=== Notification to Author ===`);
  console.log(`Post ID: ${postId}`);
  console.log(`Author: ${authorName}`);
  console.log(`Total followers: ${totalFollowers}`);
  console.log(`Successfully notified: ${successfullyNotified}`);
  console.log(`Failed to notify: ${failedToNotify}`);
  console.log(`=============================\n`);
};

//Helper function to setExpiration time
const setExpirationOnCompletion = async (postId: number) => {
  const { totalFollowersKey, processedFollowersKey, failedFollowersKey } =
    getRedisKeys(postId);
  const expirationTime = 600;

  await redisClient.expire(totalFollowersKey, expirationTime);
  await redisClient.expire(processedFollowersKey, expirationTime);
  await redisClient.expire(failedFollowersKey, expirationTime);
};

// send notification service with bull
const sendNotifications = async (postId: number, bloggerId: number) => {
  const limit = 3;
  let offset = 0;
  try {
    const totalFollowersCount = await Follower.count({
      where: {
        BloggerId: bloggerId,
      },
    });

    const { totalFollowersKey, processedFollowersKey, failedFollowersKey } =
      getRedisKeys(postId);
    const expirationTime = 3600;

    await redisClient.set(totalFollowersKey, totalFollowersCount, {
      EX: expirationTime,
    });
    await redisClient.set(processedFollowersKey, 0, {
      EX: expirationTime,
    });
    await redisClient.set(failedFollowersKey, 0, {
      EX: expirationTime,
    });

    let followers;
    do {
      followers = await getFollowers(bloggerId, limit, offset);

      if (followers.length > 0) {
        notificationQueue.add({ batch: followers, postId, bloggerId });
      }

      offset += limit;
    } while (followers.length > 0);
  } catch (err) {
    console.error("Error sending notifications:", err);
  }
};

const getFollowers = async (
  bloggerId: number,
  limit: number,
  offset: number
) => {
  return Follower.findAll({
    where: {
      BloggerId: bloggerId,
    },
    limit: limit,
    offset: offset,
  });
};

const getProgress = async (postId: number) => {
  const { totalFollowersKey, processedFollowersKey, failedFollowersKey } =
    getRedisKeys(postId);

  const totalFollowers = await redisClient.get(totalFollowersKey);
  const processedFollowers = await redisClient.get(processedFollowersKey);
  const failedFollowers = await redisClient.get(failedFollowersKey);

  if (totalFollowers && processedFollowers) {
    const progress =
      ((parseInt(processedFollowers) + parseInt(failedFollowers!)) /
        parseInt(totalFollowers)) *
      100;

    return Math.floor(progress);
  } else {
    throw new Error(`Progress data not found for postId: ${postId}`);
  }
};

export { sendNotifications, getProgress };
