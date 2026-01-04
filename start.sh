#!/bin/bash

echo "🚀 Starting MERN Chat Application..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill any existing processes
echo "📋 Cleaning up old processes..."
killall -9 node npm 2>/dev/null
sleep 2

# Start backend
echo -e "${YELLOW}Starting Backend Server...${NC}"
cd /Users/avaamo/Desktop/mern-chat-app
PORT=3500 NODE_ENV=development npm run server > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 4

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID) on port 3500${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo "Backend logs:"
    cat /tmp/backend.log
    exit 1
fi

# Start frontend
echo -e "${YELLOW}Starting Frontend Dev Server...${NC}"
cd /Users/avaamo/Desktop/mern-chat-app/frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend dev server started (PID: $FRONTEND_PID) on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    echo "Frontend logs:"
    cat /tmp/frontend.log
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Application is running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:3500"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running and show logs
wait

