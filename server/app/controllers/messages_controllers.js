/*---------------------------------------------REQUIREMENTS--------------------------------------------*/
const sequelize = require("../config/db_config");
const reqs = require("../config/config");

const sendErrorStatus = (res, status, message, code) => {
    res.status(status).json({
        "error":{
            "status"  : status,
            "message" : message,
            "code"    : code
            // add short code for easy recognition from front. Ex. Code: "MISSING_INFO", "INVALID_EMAIL", "NOT_EXIST", "SERVER_ERROR", "NO_AUTH", "INCORRECT_DATA", "REPEATED_DATA"
        }
    })
};

/*---------------------------------------------MESSAGES--------------------------------------------*/
/*-----------------ADD A MESSAGE-----------------*/
exports.addOne = (chatroom_id, message_type, sender_id, content) => {
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

/*-----------------SEE ALL MESSAGE BY CHATROOM-----------------*/
exports.findAll = (req,res) => {
    let sql = `SELECT messages.id, messages.chatroom_id, messages.message_type, messages.sender_id, messages.content, messages.sent_at, users.username as sender
        FROM messages 
        INNER JOIN users ON messages.sender_id = users.id
        WHERE chatroom_id = ?
        ORDER BY messages.sent_at DESC`;
    sequelize.query(sql, {
        replacements: [req.params.chatroom_id], type:sequelize.QueryTypes.SELECT
    }).then(all_chatrooms => {
        if (all_chatrooms.length === 0) {
            sendErrorStatus(res, 404, "Database doesn't have any message for this chatroom", "NOT_EXIST");
        } else {
            res.status(200).json(all_chatrooms);
        }
    }).catch((err)=>{
        sendErrorStatus(res, 500, `Internal Server Error: ${err}`, "SERVER_ERROR");
    })
}
