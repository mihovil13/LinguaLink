# Prva faza: Build
FROM openjdk:21-jdk-slim AS builder
WORKDIR /app

# Kopiraj Maven konfiguraciju i kod
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
COPY src src

# Omogući izvršavanje mvnw
RUN chmod +x mvnw

# Izgradi aplikaciju
RUN ./mvnw clean package -DskipTests

# Druga faza: Deploy
FROM openjdk:21-jdk-slim
WORKDIR /app

# Kopiraj izgrađeni JAR file iz build faze
COPY --from=builder /app/target/*.jar app.jar

# Postavi port koji će Render koristiti
EXPOSE 10000

# Pokreni aplikaciju
ENTRYPOINT ["java", "-jar", "app.jar"]
