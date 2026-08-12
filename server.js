import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import pool from "./src/config/db.js";
// Socket
import chatSocket from "./src/sockets/chat.socket.js";
// Migrations
import { up as chatUp } from "./src/migrations/chat.js";
import { up as todoUp } from "./src/migrations/todo.js";

// Socket setup
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("join_conversation", (conversationId) => {

        socket.join(`conversation_${conversationId}`);

        console.log(
            `Socket ${socket.id} joined conversation ${conversationId}`
        );
    });

    socket.on("disconnect", () => {

        console.log("User disconnected:", socket.id);

    });

});

const PORT = process.env.PORT || 5009;

app.set("io", io);

chatSocket(io);

const startServer = async () => {
    try {

        await pool.query("SELECT NOW()");
        console.log("Database Connected Successfully");

        await chatUp();
        console.log("Team Chat Tables Ready");

        await todoUp();
        console.log("Todo App Tables Ready");

        server.listen(PORT, () => {
            console.log(` Server running on http://localhost:${PORT}`);
        });

    } catch (error) {

        console.error(" Server Error:", error.message);
        process.exit(1);

    }
};

startServer();

process.on("SIGINT", async () => {

    await pool.end();

    console.log(" Database Disconnected");

    process.exit(0);

});

export { io };
