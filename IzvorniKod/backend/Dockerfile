# Koristi OpenJDK 21 kao osnovni image
FROM openjdk:21-jdk-slim AS builder

# Postavi radni direktorij unutar containera
WORKDIR /app

# Kopiraj potrebne fajlove iz repozitorija (bez `../../`)
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Postavi dozvole za mvnw
RUN chmod +x mvnw

# Pokreni Maven build (skidanje dependencija odvojeno radi cache-a)
RUN ./mvnw dependency:go-offline

# Kopiraj ostatak koda i napravi build
COPY src src
RUN ./mvnw clean package -DskipTests

# Koristi manji JDK image za pokretanje aplikacije
FROM openjdk:21-jdk-slim

WORKDIR /app

# Kopiraj generirani JAR iz prethodnog builda
COPY --from=builder /app/target/*.jar app.jar

# Expose porta (mora biti isti kao u Spring konfiguraciji)
EXPOSE 8080

# Pokreni aplikaciju
CMD ["java", "-jar", "app.jar"]
