# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Modernized Layerfile for React + Cypress
FROM vm/ubuntu:22.04

# Install Node.js 18 LTS + build essentials
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash && \
    apt-get install -y nodejs python3 make gcc build-essential

# Cypress OS dependencies
# https://on.cypress.io/ci#Dependencies
RUN apt-get install -y \
    libgtk2.0-0 libgtk-3-0 libgbm-dev \
    libnotify-dev libgconf-2-4 libnss3 libxss1 \
    libasound2 libxtst6 xauth xvfb wait-for-it

# VM memory + Node heap settings
MEMORY 2G
ENV NODE_OPTIONS=--max-old-space-size=2048

RUN node --version
RUN npm --version

# Copy package files first (better caching)
COPY package.json ./
COPY package-lock.json ./

# Cache npm + Cypress downloads
CACHE ~/.npm ~/.cache/Cypress

# Install dependencies
RUN npm ci

# Copy rest of the app
COPY . .

# Show Cypress install info
RUN npx cypress info

# Print CI environment variables
RUN npx @bahmutov/print-env GIT CI RETRY USER SPLIT

# Start React app in background
RUN BACKGROUND npm start

# Health check to wait until app is live before tests
RUN npx wait-on http://localhost:8888

# Create unique staging link
EXPOSE WEBSITE http://localhost:8888

# Cypress Dashboard secret
SECRET ENV CYPRESS_RECORD_KEY

# Run Cypress tests in parallel across 3 workers
SPLIT UNORDERED 3
RUN npx cypress run --record --parallel --browser chrome --headless \
  --ci-build-id $JOB_ID-$RETRY_INDEX
