// src/components/WebSocketDemo.js
import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://54.226.127.151:8000\"";

const WebSocketDemo = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Connect to the WebSocket endpoint
    const socket = new WebSocket("http://54.226.127.151:8000/ws");
    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };
    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    setWs(socket);

    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws) {
      ws.send(input);
      setInput("");
    }
  };

  return (
    <div>
      <h2>WebSocket Demo</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <h3>Messages:</h3>
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default WebSocketDemo;