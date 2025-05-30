FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copy the entire project
COPY . .

# Set execute permissions and build
RUN chmod +x backend/build.sh && \
    cd backend && \
    bash build.sh

# Run the application
CMD ["sh", "-c", "cd backend && java -jar target/*.jar"] 