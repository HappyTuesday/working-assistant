FROM openjdk:8u212-jdk-stretch
VOLUME /working-assistant
COPY target/working-assistant-1.0-SNAPSHOT.jar working-assistant.jar
ENV JAVA_OPTS=""
ENV STARTUP_ARGS=""

CMD exec java ${JAVA_OPTS} -jar working-assistant.jar ${STARTUP_ARGS}