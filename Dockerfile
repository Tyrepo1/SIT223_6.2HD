# Use a Node.js base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server application
COPY . .

# Expose the port the server runs on
EXPOSE 3000

# Command to run the server
CMD ["node", "server.js"]
