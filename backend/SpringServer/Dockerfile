FROM gradle AS BUILD
WORKDIR /usr/app/
COPY . . 
RUN gradle build --no-daemon
RUN ls

FROM openjdk
ENV ARTIFACT_NAME=SpringServer-0.0.1-SNAPSHOT.jar
ENV APP_HOME=/app/
WORKDIR $APP_HOME
COPY --from=BUILD /usr/app/build/libs/*.jar ./
RUN ls
RUN pwd
EXPOSE 5500
ENTRYPOINT exec java -jar /app/app-0.0.1-SNAPSHOT.jar