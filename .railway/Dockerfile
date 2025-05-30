FROM eclipse-temurin:21-jdk-jammy

# Create and set working directory
RUN mkdir -p /app/backend
WORKDIR /app/backend

# Copy only the necessary files first for better caching
COPY backend/mvnw .
COPY backend/.mvn .mvn
COPY backend/pom.xml .

# Make mvnw executable and download dependencies
RUN chmod +x mvnw && \
    ./mvnw dependency:go-offline

# Copy the rest of the application
COPY backend/src src/

# Build the application
RUN ./mvnw package -DskipTests

# Run the application
ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"] 