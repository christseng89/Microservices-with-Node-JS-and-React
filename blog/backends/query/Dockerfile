FROM node:16-alpine

WORKDIR /app
COPY package.json ./
RUN npm install && npm install --location=global nodemon
COPY ./ ./

CMD ["npm", "start"]