import { io } from "socket.io-client";

const socketClient = io("http://localhost:3000", {
    withCredentials: true,
    // autoConnect: false,
});

export default socketClient;