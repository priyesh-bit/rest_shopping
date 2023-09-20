const app = require("./app");
const { generalHandler } = require("./api/socket/socket");

const server = require('http').createServer(app);
const ngrok = require("@ngrok/ngrok");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

const io = require('socket.io')(server);
const chatPath = io.of('/chat')
chatPath.on('connection', generalHandler);

server.listen(port);

ngrok.connect({ addr: `localhost:${port}`, authtoken: process.env.NGROK_AUTH }).then((url) => {
    console.log(`Ingress established at: ${url}`);
});