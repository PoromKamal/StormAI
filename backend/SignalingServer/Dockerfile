FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
ENV NODE_ENV=production

# Bundle app source
COPY . .

EXPOSE 4444
CMD [ "node", "server.js" ]