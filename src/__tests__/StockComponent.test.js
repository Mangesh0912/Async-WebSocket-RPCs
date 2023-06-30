import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import StockComponent from "../components/StockComponent";
import { act } from "react-dom/test-utils";

jest.mock("ws");

test("App which is a Websocket component renders as expected", async () => {
  const mockWebSocket = {
    send: jest.fn(),
    close: jest.fn(),
    onopen: null,
    onmessage: null,
    onerror: null,
    readyState: 1, // Open connection state
  };

  global.WebSocket = jest.fn().mockImplementation(() => mockWebSocket);

  render(<StockComponent/>);

  // Simulate WebSocket connection open
  act(() => {
     mockWebSocket.onopen?.({data : []});
  });

  const data = "{\"meta\":{\"status\":200,\"message\":\"success\",\"method\":\"Demo Get financial Data\",\"symbol\":\"AAPL\",\"name\":\"Apple Inc\"},\"data\":[{\"date\":\"2023-06-27T23:34:53+00:00\",\"open\":367.686,\"close\":376.295,\"high\":382.8701878802774,\"low\":361.078},{\"date\":\"2023-06-26T23:34:53+00:00\",\"open\":376.197,\"close\":378.787,\"high\":386.11718788027736,\"low\":364.325},{\"date\":\"2023-06-25T23:34:53+00:00\",\"open\":366.574,\"close\":381.541,\"high\":384.0281878802774,\"low\":362.236},{\"date\":\"2023-06-24T23:34:53+00:00\",\"open\":365.658,\"close\":360.849,\"high\":381.5131878802774,\"low\":359.721},{\"date\":\"2023-06-23T23:34:53+00:00\",\"open\":374.553,\"close\":371.553,\"high\":388.4241878802774,\"low\":366.632}]}";

  // Simulate Websocket recieving data from the server.
  act(() => {
    mockWebSocket.onmessage?.({data: data});
  });

  await waitFor(() => {
    expect(screen.getByText(`Apple Stock Data`)).toBeInTheDocument();
  });

});
