const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let messages = []; // Store messages temporarily

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('loadMessages', messages);

    socket.on('sendMessage', (data) => {
        messages.push(data);
        io.emit('receiveMessage', data);
    });

    socket.on('clearChat', () => {
        console.log("Chat cleared by user");
        messages = [];
        io.emit("clearChat");
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// ✅ Serve static frontend files from "public/" folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Redirect all other routes to chatroom.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "chatroom.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
