const PORT = 8001;
const { WebSocketServer } = require('ws');

let ws = new WebSocketServer({ port: PORT, path: '/ws' }, () => {
    console.log(`Server is up running on ${PORT}`);
});


let ID = 0;

ws.on("connection", (client, request) => {
    client.id = ID++;
    console.log(`new client: ${ID}`);
    
    client.send(JSON.stringify({ message: "Hello from server" }));
    
    client.on("message", (message) => {
    let parsedMessage;
    try {
    parsedMessage = JSON.parse(message);
    } catch (error) {
        console.error('Invalid JSON received:', message);
        return;
    }
    
    const responseMessage = {
        type: 'message',
        userId: parsedMessage.userId,
        message: parsedMessage.message,
        channelId: parsedMessage.channelId,
    };
    client.send(JSON.stringify(responseMessage));
    });
});

ws.on("close", (client, request) => {
    console.log(`client disconnected: ${client.id}`);
});