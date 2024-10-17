# Step 1: Use the official Node.js 16 image as the base image
FROM node:16-alpine

# Step 2: Set the working directory inside the container
WORKDIR /

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 6: Install TypeScript globally and build the TypeScript files
RUN npm install -g typescript
RUN tsc

# Step 7: Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Step 8: Define the command to run the app (it will run the compiled JavaScript)
CMD ["node", "dist/index.js"]
