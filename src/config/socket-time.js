import { io } from "socket.io-client";
const socket = io("http://localhost:5009");
socket.on("connect", () => {

    console.log("Socket Connected:", socket.id);

    socket.emit("join_conversation", 1);

    console.log("Joined Conversation: 1");

});
socket.on("newMessage", (message) => {

    console.log("MESSAGE RECEIVED:", message);

});
socket.on("disconnect", () => {

    console.log("Socket Disconnected");

});