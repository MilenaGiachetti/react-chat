/*---------------------------------------------REQUIREMENTS--------------------------------------------*/
const reqs = require("./app/config/config");
var app = require("express")();

var http = require("http").createServer(reqs.app);
// passes to socket the http server object
var io = require("socket.io")(http);

const sequelize = require("./app/config/db_config");

const addMessage = (chatroom_id, message_type, sender_id, content) => {
	// chatroom_id, sender_id, message_type ('text'), content
	let message = {
		id: null,
		chatroom_id:  chatroom_id,
		message_type: message_type,
		sender_id:   sender_id,
		content: content,
		sent_at : null
	};
	console.log(message);
	let sql = `INSERT INTO messages VALUES (:id, :chatroom_id, :message_type, :sender_id, :content, :sent_at)`;
	sequelize.query(sql, {
		replacements: message
	}).then(result => {
		message.id = result[0];
	}).catch((err)=>{
		console.error(err);
	})
}

// var current_user_id = null;
// listen to socket connection
io.on("connection", (socket) => {
	console.log("a user connected");
	// socket.on("send_user_id", (user_id) => {
	// 	current_user_id = user_id;
	// });
	socket.on("join_chat", (chat_name) => {
		socket.join(chat_name);   
		console.log("joined chat: " + chat_name);
		socket.on("new_chat_message", (msg) => {
			io.to(chat_name).emit("new_chat_message", msg);
			let msgJSON = JSON.parse(msg);
			addMessage(msgJSON.chatroom_id, msgJSON.message_type, msgJSON.sender_id, msgJSON.content);
			console.log("message: " + msg);
		});
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