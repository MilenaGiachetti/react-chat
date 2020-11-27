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
exports.addOne = (req,res) => {
    // needed info: chatroom_id, sender_id, message_type ('text'), content - json
    let missingInfo = [];
    req.body.type   !== undefined ? "" : missingInfo.push("chat type");
    req.body.name   !== undefined ? "" : missingInfo.push("chat name");
    // req.body.description !== undefined ? "" : missingInfo.push("chat description"); - optional
    
    let incorrectType = (req.body.type !== 'private' && req.body.type !== 'group' && req.body.type !== 'public') ? true : false;

    if (missingInfo.length === 0 && incorrectType === false) {
        let sql =  
            `SELECT id
            FROM chatrooms 
            WHERE type = ? AND name = ?`;
        sequelize.query(sql, {
            replacements: [req.body.type, req.body.name], type:sequelize.QueryTypes.SELECT
        }).then(repeated_chatroom => {
            if (repeated_chatroom.length === 0) {
                let chatroom = {
                    id: null,
                    creator_id:  req.user[0].id,
                    type:        req.body.type,
                    name:        req.body.name,
                    description: req.body.description !== undefined ? req.body.description : null,
                    created_at : null,
                    updated_at : null
                }
                let sql = `INSERT INTO chatrooms VALUES (:id, :creator_id, :type, :name, :description, :created_at, updated_at)`;
                sequelize.query(sql, {
                    replacements: chatroom
                }).then(result => {
                    chatroom.id = result[0];
                    res.status(200).json(chatroom);
                }).catch((err)=>{
                    sendErrorStatus(res, 500, `Internal Server Error: ${err}`, "SERVER_ERROR");
                })
            } else {
                sendErrorStatus(res, 400, "A chat of this type with this name already exists", "REPEATED_DATA");
            }   
        }).catch((err) => {
            sendErrorStatus(res, 500, `Internal Server Error: ${err}`, "SERVER_ERROR");
        })
    } else {
        if (incorrectType) {
            sendErrorStatus(res, 400, "Incorrect chat type", "INCORRECT_DATA");
        } else {
            sendErrorStatus(res, 400, `Missing data: ${missingInfo.join(" - ")}`, "MISSING_DATA");
        }
    }
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
