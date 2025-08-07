FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Set the API URL to connect to the API container
# This assumes your API container will be accessible via the 'server' hostname
ENV NEXT_PUBLIC_API_URL=http://localhost:8080/

# Build the Next.js application
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=http://server:8080/
# Expose port 3000
EXPOSE 3000

# Start Next.js in dev mode to allow dynamic data fetching during development
CMD ["npm", "start"]