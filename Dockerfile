# Use the official Node.js image as the base image
FROM node:16.20.0 AS build

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

# Copy the application code
COPY . /app/

# Build the production-ready optimized code
RUN yarn build

# Use a lightweight Node.js image for serving the static files
FROM node:16.20.0-alpine AS production

# Set the working directory in the container
WORKDIR /app

# Copy the built code from the build stage
COPY --from=build /app/build /app/build

# Install serve to run the production server
RUN yarn global add serve

# Expose the production server port
EXPOSE 80

# Start the production server
CMD ["serve", "-s", "build", "-l", "80"]
