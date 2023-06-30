import "../styles/App.css";
import React, { useEffect, useState } from "react";
import StockList from "./StockList";
import LoadMask from "./common/Loadmask";

function StockComponent() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    // handler when the websocket is connected
    ws.onopen = () => {
      const requestId = Date.now();
      setConnectionStatus("connected");
      const messageObject = {
        route: "getStockData",
        data: {
          text: message,
        },
        requestId,
      };
      ws.send(JSON.stringify(messageObject));
    };

    ws.onmessage = (event) => {
      setLoading(false);
      if (event && event.data) {
        const responseMessage = JSON.parse(event.data);
        if (responseMessage.error) {
          setConnectionStatus("error");
          setErrorMessage(responseMessage.error);
        } else {
          setResponse(responseMessage.data);
        }
      }
    };

    ws.onerror = (err) => {
      setConnectionStatus("error");
      setErrorMessage(
        "WebSocket connection error, Please try again after some time"
      );
    };

    ws.onclose = (err) => {
         console.log("on close!!")
         if(connectionStatus !== 'error') {
             setConnectionStatus("closed");
             setErrorMessage("Websocket closed, Please try again after some time")
         }
    }

    return () => {
      if (ws.readyState === ws.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div>
      { loading && (connectionStatus !== 'error' && connectionStatus !== 'closed') && <LoadMask />}
      {(connectionStatus === "error" || connectionStatus === 'closed') && (
        <p className="error">Error: {errorMessage}</p>
      )}
      <div>{response && <StockList data={response} />}</div>
    </div>
  );
}

export default StockComponent;
