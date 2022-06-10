FROM node:16-alpine

WORKDIR /app
COPY package.json ./
RUN npm install && npm install --location=global nodemon
COPY ./ ./

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
CMD ["npm", "start"]