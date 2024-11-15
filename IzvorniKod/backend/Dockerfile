
# Koristi OpenJDK kao bazu
FROM openjdk:21-jdk

# Postavi radni direktorij
WORKDIR /app

# Kopiraj Maven Wrapper i konfiguraciju
COPY .mvn/ .mvn/
COPY mvnw .
COPY pom.xml .

# Preuzmi Maven dependency-je
RUN ./mvnw dependency:resolve

# Kopiraj sav izvorni kod
COPY src ./src

# Gradnja aplikacije
RUN ./mvnw clean package -DskipTests

# Dodaj korisnika
RUN groupadd -r app && useradd -r -g app app
USER app

# Pokreni aplikaciju s ispravnim imenom JAR datoteke
ENTRYPOINT ["java", "-jar", "target/demo-0.0.1-SNAPSHOT.jar", "-web -webAllowOthers -tcp -tcpAllowOthers -browser"]
