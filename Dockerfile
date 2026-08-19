FROM node:20-slim

WORKDIR /app

# Install openssl and certificates required for Prisma query engine
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package configurations
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/

# Install root, shared and backend dependencies
RUN npm install
RUN cd shared && npm install
RUN cd backend && npm install

# Copy source code
COPY shared ./shared
COPY backend ./backend

# Build backend and generate Prisma client
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

# Seed database and start server
CMD ["sh", "-c", "npx prisma db push && npm run prisma:seed && npm start"]
