#!/bin/bash

cd frontend

echo "# Installing dependencies..."
npm install

echo "# Building..."
npm run build

cd ../

cd websocket-server

echo "# Installing dependencies..."
npm install

echo "# JWT Secret Generate..."
php artisan jwt:secret

echo "# Link storage..."
php artisan storage:link

echo "# Start the PHP application in the background"
php artisan serve --host=0.0.0.0 --port=8000 &

cd websocket-server
echo "# Start the websocket server"
npm run dev

cd ../

cd frontend

echo "# Start the Node.js application concurrently"
npm run preview