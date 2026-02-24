# -------- Build Stage --------
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src
RUN ./mvnw clean package -DskipTests


# -------- Runtime Stage --------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/imdb-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]