// PACKAGE: https://www.npmjs.com/package/ws
// API DOCS: https://github.com/websockets/ws/blob/HEAD/doc/ws.md
const WebSocket = require('ws');

// add a web socket server on port 3300
const server = new WebSocket.Server({ port: 3030 });

// web socket server CONNECTION Event emitted when the handshake is complete
server.on('connection', function connection(socket) {
	// web socket MESSAGE Emitted when a message is received from the server.
	socket.on('message', function incoming(data) {
		// web socket server CLIENTS A set that stores all connected clients. Please note that this property is only added when the clientTracking is truthy.
		server.clients.forEach(function each(client) {
			if (client !== socket && client.readyState === WebSocket.OPEN) {
				// SEND Send data through the connection.
				client.send(data);
			}
		});
	});
});