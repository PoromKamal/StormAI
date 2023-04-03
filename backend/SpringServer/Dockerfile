#FROM gradle:6.5-jdk8

#WORKDIR /tmp
#ADD . /tmp

#RUN gradle build

#CMD ["gradle", "clean", "bootRun"]
#EXPOSE 5500

FROM openjdk
EXPOSE 5500
COPY /build/libs/SpringServer-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
