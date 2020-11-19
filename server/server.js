/*---------------------------------------------REQUIREMENTS--------------------------------------------*/
const reqs = require('./app/config/config');
var app = require('express')();

var http = require('http').createServer(reqs.app);
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


/*---------------------------------------------ROUTES--------------------------------------------*/
require('./app/routes/users_routes')(reqs.app);
reqs.app.get('/*', (req, res)=> {
    res.status(404).send("Error: Endpoint no existente");
})


http.listen(4001, () => {
  	console.log('listening on *:4001');
});