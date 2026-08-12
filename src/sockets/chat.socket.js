export default function chatSocket(io) {

    io.on("connection", (socket) => {


        console.log("User Connected:", socket.id);


        // Join Conversation Room

        socket.on(
            "joinConversation",
            (conversation_id) => {

                socket.join(
                    conversation_id.toString()
                );


                console.log(
                    "Joined Room:",
                    conversation_id
                );

            }
        );


        // Disconnect

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "User Disconnected:",
                    socket.id
                );

            }
        );


    });


}