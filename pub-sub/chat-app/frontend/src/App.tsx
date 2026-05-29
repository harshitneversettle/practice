import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import "./App.css";

function App() {
  const wsRef = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [allMsg, setAllMsg] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const port = searchParams.get("port") || "8080" ;

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:${port}`);

    ws.onopen = () => {
      console.log("connected to a ws server");
    };

    ws.onmessage = async (e) => {    // this is to handle the message sent by the server 
      const msg = await e.data;
      console.log(msg)
      setAllMsg((prev) => [...prev,  msg]);
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [port]);

  async function handleSend() {
    if (!wsRef.current) return;
    wsRef.current.send(message);
    setMessage("");
  }

  return (
    <div
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          overflowY: "auto",
        }}
      >
        {allMsg.map((msg, index) => (
          <div
            key={index}
            style={{
              color: "white",
              backgroundColor: "#111",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "10px",
              fontSize: "20px",
              width: "fit-content",
              maxWidth: "80%",
            }}
          >
            {msg}
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          gap: "10px",
          paddingTop: "16px",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#111",
            color: "white",
            outline: "none",
            fontSize: "18px",
          }}
        />

        <button
          onClick={handleSend}
          style={{
            padding: "14px 24px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "white",
            color: "black",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
