FROM node:20-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS server
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install --only=production
COPY server/ ./server/
COPY --from=build-client /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=5001
EXPOSE 5001

CMD ["node", "server/src/server.js"]

