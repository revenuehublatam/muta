# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY server.js /app/server.js
COPY public /app/public
EXPOSE 80
CMD ["node","/app/server.js"]
