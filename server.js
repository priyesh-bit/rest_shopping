const http = require("http");
const app = require("./app");
// const ngrok = require("@ngrok/ngrok");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

const server = http.createServer(app);

server.listen(port);

// ngrok.connect({ addr: `localhost:${port}`, authtoken: process.env.NGROK_AUTH }).then((url) => {
//     console.log(`Ingress established at: ${url}`);
// });