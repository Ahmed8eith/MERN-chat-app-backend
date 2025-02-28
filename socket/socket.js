import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // Allow your client domain (and any other valid domain if needed)
    origin: [
      "https://chat-app52684.netlify.app",
      "https://67c21ea5d6604c5baa98cc8a--chat-app52684.netlify.app"
    ],
    methods: ['GET', 'POST']
  }
});

export const getReciverSocketId = (reciverId) => {
    return userSocketMap[reciverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
    console.log("a user connected, ", socket.id);
    const userId = socket.handshake.auth.userId;
    if (userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
