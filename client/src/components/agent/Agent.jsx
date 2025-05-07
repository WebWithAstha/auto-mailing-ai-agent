import React, { useEffect, useState } from "react";
import "./Agent.css";
import socketClient from "../../utils/socket";

const Agent = () => {
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setisTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (input.trim() === "") return;
    // console.log("sending msg : ", input);
    const newMessage = { text: input, role: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    // console.log("msg obj : ", newMessage);
    setisTyping(true);
    socketClient.emit("message", newMessage);
  };

  useEffect(() => {


    socketClient.on("auth_error", (error) => {
        console.log(error)
    })
    socketClient.connect();
    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setisTyping(false);
    };

    

    socketClient.on("chatHistory", (chatHistory) => {
        const parsedHistory = chatHistory.map((message) => {
            return {
            text: message.parts[0].text,
            role: message.role,
            };
        });
        setMessages((prevMessages) => [...prevMessages, ...parsedHistory]);
    })

    socketClient.on("message", handleMessage);

    return () => {
      socketClient.off("message", handleMessage); // Clean up the listener
    };
  }, []);

  return (
    <main className="agent-main">
      <section>
        <div className="chat-header">Chat with Aura</div>
        <div className="chat-messages" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
          {messages.map((message, index) => (
            <div key={index} className={`message message-${message.role}`}>
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message message-agent typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
        </div>
        <div className="chat-input-bar">
          <input
            type="text"
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={({ key }) => key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="send-button">
            Send
          </button>
        </div>
      </section>
    </main>
  );
};

export default Agent;
