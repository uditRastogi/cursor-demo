#!/bin/bash
set -e

echo "Starting application from $(pwd)"
echo "Listing target directory:"
ls -la target/

echo "Starting Java application..."
exec java -jar target/backend-0.0.1-SNAPSHOT.jar 