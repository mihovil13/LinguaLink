# Prva faza: Build faza
FROM openjdk:21-jdk-slim AS builder

# Kopiraj potrebne datoteke
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
COPY src src

# Postavi dozvole za mvnw
RUN chmod +x mvnw

# Izvrši Maven build
RUN ./mvnw clean package

# Druga faza: Deploy faza
FROM openjdk:21-jdk-slim

# Kopiraj izgrađeni JAR file
COPY --from=builder target/*.jar /app.jar

# Otvori port 8080
EXPOSE 8080

# Pokreni aplikaciju
ENTRYPOINT ["java", "-jar", "/app.jar"]
