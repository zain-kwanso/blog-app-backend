FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Step 6: Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Step 7: Define the command to start your application in development mode
CMD ["npm", "run", "start"]
