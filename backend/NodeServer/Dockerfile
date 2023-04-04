FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ENV OPENAI_API_KEY=example
ENV HUGGINFACE_API_KEY=example
ENV STORYBOT_SERVER_URL=https://api-inference.huggingface.co/models/bigscience/bloom

EXPOSE 5000
CMD [ "node", "index.js" ]