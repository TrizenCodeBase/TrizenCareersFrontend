#!/bin/bash

echo "🧪 Testing Docker Build for Frontend"
echo "====================================="

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t trizen-careers-frontend:test .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    # Test running the container
    echo "🚀 Testing container startup..."
    docker run -d --name test-frontend -p 8080:80 trizen-careers-frontend:test
    
    if [ $? -eq 0 ]; then
        echo "✅ Container started successfully!"
        
        # Wait a moment for nginx to start
        sleep 3
        
        # Test if the application is responding
        echo "🔍 Testing application response..."
        response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)
        
        if [ "$response" = "200" ]; then
            echo "✅ Application is responding correctly (HTTP 200)"
        else
            echo "❌ Application returned HTTP $response"
        fi
        
        # Clean up
        echo "🧹 Cleaning up test container..."
        docker stop test-frontend
        docker rm test-frontend
    else
        echo "❌ Failed to start container"
    fi
else
    echo "❌ Docker build failed!"
    exit 1
fi

echo "📊 Docker build test completed!"
