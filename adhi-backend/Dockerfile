# Multi-stage Dockerfile for Spring Boot
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Create upload directories just in case
RUN mkdir -p uploads/houses

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Entry point execution
ENTRYPOINT ["java", "-jar", "app.jar"]
