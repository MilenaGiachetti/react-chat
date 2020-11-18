// PACKAGE: https://www.npmjs.com/package/ws
// API DOCS: https://github.com/websockets/ws/blob/HEAD/doc/ws.md
// const WebSocket = require('ws');

// // add https://socket.io/ ?

// // add a web socket server on port 3030
// const server = new WebSocket.Server({ port: 3030 });

// // web socket server CONNECTION Event emitted when the handshake is complete
// server.on('connection', function connection(socket) {
// 	// web socket MESSAGE Emitted when a message is received from the server.
// 	socket.on('message', function incoming(data) {
// 		// web socket server CLIENTS A set that stores all connected clients. Please note that this property is only added when the clientTracking is truthy.
// 		server.clients.forEach(function each(client) {
// 			if (client !== socket && client.readyState === WebSocket.OPEN) {
// 				// SEND Send data through the connection.
// 				client.send(data);
// 			}
// 		});
// 	});
// });

// const app = require('express')();
// const PORT = 4000;
// const server = require('http').createServer(app);
// const options = { 
//     maxHttpBufferSize: 1e8
// };
// const io = require('socket.io')(server, options);

// const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

// io.on('connection', socket => { 
//     const handshake = socket.handshake;
//     socket.on('NEW_CHAT_MESSAGE_EVENT', (data )=> {
//         io.emit(NEW_CHAT_MESSAGE_EVENT, data);
//         // web socket server CLIENTS A set that stores all connected clients. Please note that this property is only added when the clientTracking is truthy.
//         // io.clients.forEach(function each(client) {
//         //     if (client !== socket && client.readyState === WebSocket.OPEN) {
//         //         // SEND Send data through the connection.
//         //         client.send(data);
//         //     }
//         // });
//     });
// });

// server.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`);

var app = require('express')();
var http = require('http').createServer(app);
// passes to socket the http server object
var io = require('socket.io')(http);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// listen to socket connection
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('join_chat', (chat_name) => {
    socket.join(chat_name);   
    console.log(chat_name);
    console.log('joined_chat');
    socket.on('new_chat_message', (msg) => {
      io.to(chat_name).emit('new_chat_message', msg);
      console.log('message: ' + msg);
    });
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(4001, () => {
  console.log('listening on *:4001');
});