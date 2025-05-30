FROM eclipse-temurin:21-jdk-jammy

# Set working directory
WORKDIR /app

# Copy the entire backend directory
COPY backend .

# Make mvnw executable
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Run the application
ENTRYPOINT java -jar target/backend-0.0.1-SNAPSHOT.jar 