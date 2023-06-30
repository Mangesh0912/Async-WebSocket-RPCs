const WebSocket = require("ws");
const http = require("http");

class WebSocketRouter {
  constructor() {
    this.routes = {};
    this.nextRequested = 1;
  }

  addRoute(route, handler) {
    this.routes[route] = handler;
  }

  // generic function to handle incoming request and prepare the response
  handleRequest(request, ws) {
    const { route } = JSON.parse(request);

    switch (route) {
      case "getStockData":
        setInterval(async () => {
          const result = await getStockDetails();
          ws.send(result);
        }, 3000);
        break;
      default:
        const errorMessage = JSON.stringify({ error: "Route Not found" });
        ws.send(errorMessage);
        break;
    }
  }

  start(port) {
    const wss = new WebSocket.Server({ port });
    const current = this;

    wss.on("connection", (ws) => {
      ws.on("message", function (request) {
        current.handleRequest(request, ws);
      });
    });
  }
}

// generic function to fetch the data
const fetchData = (options) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      res.setEncoding("utf-8");
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error("statusCode=" + res.statusCode));
      }
      let body;
      res.on("data", function (chunk) {
        resolve(chunk);
      });
    });
    req.on("error", (e) => {
      reject(e.message);
    });
    //send the request
    req.end();
  });
};

// function to fetch latest values of stocks from the api
const getStockDetails = async () => {
  const options = {
    hostname: "ffd-api.click",
    path: "/api/v1/findata/demo",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let result = "";
  try {
    result = await fetchData(options);
  } catch (err) {
    result = err;
  }
  return result;
};

const router = new WebSocketRouter();

//Define routes
router.addRoute("getStockData", () => {});
router.start(8080);
