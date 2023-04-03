#FROM gradle:6.5-jdk8

#WORKDIR /tmp
#ADD . /tmp

#RUN gradle build

#CMD ["gradle", "clean", "bootRun"]
#EXPOSE 5500

#FROM openjdk
#RUN microdnf install findutils
#EXPOSE 5500
#WORKDIR /app
#COPY ./ .
#RUN chmod +x gradlew
#RUN ./gradlew build
#COPY ./ .
#COPY /build/libs/SpringServer-0.0.1-SNAPSHOT.jar app.jar
#ENTRYPOINT ["java", "-jar", "/app/build/libs/SpringServer-0.0.1-SNAPSHOT.jar"]


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