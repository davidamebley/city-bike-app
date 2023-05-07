# Build frontend
FROM node as frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node as backend-build
COPY package*.json ./
COPY tsconfig.json ./
COPY backend/ ./backend
RUN npm install
RUN npm run build

# Final image
FROM node
WORKDIR /app
COPY --from=frontend-build /frontend/build ./frontend/build
COPY --from=backend-build /backend/dist ./backend
COPY package*.json ./
RUN npm install --production
EXPOSE 5000
CMD ["npm", "run", "start"]