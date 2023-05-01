# Build frontend
FROM node as frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node as backend-build
WORKDIR /backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Final image
FROM node
WORKDIR /app
COPY --from=frontend-build /frontend/build ./frontend/build
COPY --from=backend-build /backend ./backend
COPY package*.json ./
RUN npm install --production
EXPOSE 5000
CMD ["node", "backend/Server.ts"]