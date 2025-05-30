FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copy the backend directory first
COPY backend backend/

# Set JAVA_HOME explicitly
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Verify Java installation
RUN java -version && \
    echo "JAVA_HOME is set to: ${JAVA_HOME}"

# Make scripts executable and build
RUN cd backend && \
    chmod +x mvnw && \
    ./mvnw clean package -DskipTests && \
    chmod +x start.sh

# Set the working directory to backend
WORKDIR /app/backend

# Run the application using the startup script
CMD ["./start.sh"] 