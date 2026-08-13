FROM node:20-alpine

WORKDIR /app

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

# Build and seed backend
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build
RUN npm run prisma:seed

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["npm", "start"]
