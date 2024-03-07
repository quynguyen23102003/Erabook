# syntax=docker/dockerfile:1
FROM node:20-alpine
# RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY . .
RUN npm install
RUN npm run clean
RUN npm run compile
CMD ["npm", "start"]
