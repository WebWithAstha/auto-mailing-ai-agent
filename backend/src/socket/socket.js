import { Server } from "socket.io";
import http from "http";
import cookie from "cookie";
import User from "../models/userModel.js";
import getResponse from "../services/ai.service.js";
import { appendMessage, getMessages } from "../services/cache.service.js";

export const initializeSocket = (app) => {
  console.log("initializing socket io ⌚");
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Allow all origins, adjust as needed
      methods: ["GET", "POST"],
      credentials: true, // Allow credentials (cookies) to be sent
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) {
        console.log("No cookies found in the request headers.");
        socket.emit("auth_error", { message: "No cookies found in the request headers." });
        return next(new Error("Authentication error: No cookies found"));
      }

      const { token } = cookie.parse(cookies);
      if (!token) {
        console.log("token not found in cookies.");
        socket.emit("auth_error", { message: "No token found in cookies." });
        return next(new Error("Authentication error: No token found"));
      }
      
      const user = await User.verifyJwtToken(token);
      if (!user) {
        console.log("user not found or invalid token.");
        socket.emit("auth_error", { message: "Invalid token." });
        return next(new Error("Authentication error: Invalid token"));
      }

      socket.user = user;
      return next();
    } catch (error) {
      console.error("Socket auth middleware error:", error);
      socket.emit("auth_error", { message: "Server error during authentication." });
      return next(new Error("Authentication error: Server error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("A user connected: ", socket.id);

    const chatHistory = await getMessages(`conversation:${socket.user._id}`);
    socket.emit("chatHistory",chatHistory)

    socket.on("message", async (messageObj) => {

      // console.log("Message received: ", messageObj);

      // Append message to Redis cache or any other storage
      await appendMessage(`conversation:${socket.user._id}`, messageObj);

      const conversationHistory  = await getMessages(`conversation:${socket.user._id}`);
      // console.log("conversation history: ", JSON.stringify(conversationHistory));

      // Handle incoming messages here
      const response = await getResponse(conversationHistory,socket.user);

      // console.log("response from AI: ", response);

      const responseObj = {
        text: response,
        role: 'model',
      };
      // Append response to Redis cache or any other storage
      await appendMessage(`conversation:${socket.user._id}`, responseObj);

      socket.emit("message", responseObj); // Send response back to the client
      // console.log("resonse sent to client");
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
    });
  });

  return server;
};
