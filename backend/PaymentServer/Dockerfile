FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ENV STRIPE_API_KEY=example

EXPOSE 3001
CMD [ "node", "index.js" ]