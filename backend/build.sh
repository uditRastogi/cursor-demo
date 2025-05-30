#!/bin/bash
set -e

# Find Java installation
JAVA_PATH=$(dirname $(dirname $(readlink -f $(which java))))
export JAVA_HOME=$JAVA_PATH

echo "Using JAVA_HOME: $JAVA_HOME"
echo "Java version:"
java -version

# Make mvnw executable
chmod +x mvnw

# Build the application
./mvnw package -DskipTests 