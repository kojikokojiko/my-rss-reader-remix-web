# Base stage
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app
# Update npm to the latest version
# RUN npm install -g npm@latest

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json ./
RUN node -v
RUN npm -v
RUN npm install

# Build stage
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Required files for production
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]