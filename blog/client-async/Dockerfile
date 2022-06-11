FROM node:16-alpine

# Add the following lines
ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

ARG DOCKER_ENV
ENV REACT_APP_HOST=${DOCKER_ENV}
CMD ["npm", "start"]