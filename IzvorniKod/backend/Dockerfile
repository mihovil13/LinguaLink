FROM openjdk:21-jdk AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

#COPY src ./src

RUN mvn clean package

FROM openjdk:21-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar", "-web", "-webAllowOthers", "-tcp", "-tcpAllowOthers", "-browser"]
