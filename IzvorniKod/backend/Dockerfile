# Prvi stage: build
FROM openjdk:21-jdk AS build

WORKDIR /app

# Kopiraj pom.xml
#COPY pom.xml .

# Pokreni mvn clean package
RUN mvn clean package

# Drugi stage: runtime
FROM openjdk:21-jdk

WORKDIR /app

# Kopiraj JAR datoteku iz build stage-a
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar", "-web", "-webAllowOthers", "-tcp", "-tcpAllowOthers", "-browser"]
