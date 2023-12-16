const PORT = 8001;
const {  WebSocketServer } = require('ws');

let ws = new WebSocketServer({ port: PORT, path: '/ws' },() => {
    console.log(`Server is up running on ${PORT}`);
});

let ID = 0;

ws.on("connection", (client, request) => {
    client.id = ID++;
    console.log(`new client: ${ID}`);
});

ws.on("close", (client, request) => {
    console.log(`new client: ${client.id}`);
});