# Use a lightweight Node.js base image
# 'alpine' variants are smaller, good for production
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
# This layer will be cached unless you change dependencies
COPY package*.json ./

# Install application dependencies
# Use 'npm ci' for cleaner installs in CI/CD or Docker builds if you have package-lock.json
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Inform Docker that the container listens on the specified network port at runtime.
# EXPOSE does not actually publish the port, but acts as documentation
# Replace 3000 with the port your Node.js app listens on (matching the PORT env var default)
EXPOSE 3000

# Define the command to run your application when the container starts
# Use the command you would run locally to start your server
CMD [ "node", "src/server.js" ]
