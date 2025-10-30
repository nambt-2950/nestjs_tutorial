# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all source code
COPY . .

# Build the project
RUN yarn build

# Expose port (NestJS default)
EXPOSE 3000

# Command for production
CMD ["yarn", "start:prod"]