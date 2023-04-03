FROM node AS prod
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:alpine
COPY --from=prod /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

#REACT_APP_NODE_SERVER = "http://localhost:5000"