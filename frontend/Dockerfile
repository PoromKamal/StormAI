FROM node AS prod
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
RUN npm run build

ENV REACT_APP_AUTH_SERVER=https://auth.stormai.live/
ENV REACT_APP_STORY_BOT_SERVER=https://api-inference.huggingface.co/models/bigscience/bloom
ENV REACT_APP_HUGGINGFACE_TOKEN=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
ENV REACT_APP_ARTIST_BOT_SERVER=https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5
#ENV REACT_APP_NODE_SERVER=$REACT_APP_NODE_SERVER

FROM nginx:alpine
COPY --from=prod /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

#REACT_APP_NODE_SERVER = "http://localhost:5000"