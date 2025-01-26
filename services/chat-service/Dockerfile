# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) from the correct location
COPY services/chat-service/package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the app (everything inside chat-service/) into the container
COPY services/chat-service/ ./

# Expose the port the app runs on
EXPOSE 8022

# Define the command to run your app
CMD ["npm", "run", "dev"]
