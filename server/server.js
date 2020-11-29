/*---------------------------------------------REQUIREMENTS--------------------------------------------*/
const reqs = require("./app/config/config");
var app = require("express")();

var http = require("http").createServer(reqs.app);
// passes to socket the http server object
var io = require("socket.io")(http);

const messages = require("./app/controllers/messages_controllers");

// listen to socket connection
io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("join_chat", (chat_name) => {
		socket.join(chat_name);   
		console.log("joined chat: " + chat_name);
		socket.on("new_chat_message", (msg) => {
			io.to(chat_name).emit("new_chat_message", msg);
			let msgJSON = JSON.parse(msg);
			messages.addOne(msgJSON.chatroom_id, msgJSON.message_type, msgJSON.sender_id, msgJSON.content);
			console.log("message: " + msg);
		});
	});
	socket.on("leave_chat", (chat_name) =>{
		console.log("left chat: " + chat_name);
		socket.leave(chat_name);
		// io.to(chat_name).emit(`user ${socket.id} has left the room`);
	});
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});


/*---------------------------------------------ROUTES--------------------------------------------*/
require("./app/routes/users_routes")(reqs.app);
require("./app/routes/chatrooms_routes")(reqs.app);
require("./app/routes/messages_routes")(reqs.app);
reqs.app.get("/*", (req, res)=> {
    res.status(404).send("Error: This endpoint doesn't exist");
})


http.listen(4001, () => {
  	console.log("listening on Port: 4001");
});