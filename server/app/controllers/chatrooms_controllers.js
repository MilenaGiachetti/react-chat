/*---------------------------------------------REQUIREMENTS--------------------------------------------*/
const sequelize = require("../config/db_config");
const reqs = require("../config/config");

const validateEmail = (email) => {
    let emailregex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailregex.test(email);
}

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
// sendErrorStatus(res, status, message, code);

/*---------------------------------------------CHATS--------------------------------------------*/
/*-----------------ADD A CHAT-----------------*/
exports.addOne = (req,res) => {
    // needed info: creator_id (sent in auth), type, name, description(optional) - json
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

/*-----------------SEE ALL CHATROOMS-----------------*/
// Modify so user can get all th public chatrooms and all the private and group chatrooms they participe in - maybe have an optional param for chatroom type :type
exports.findAll = (req,res) => {
    let sql = `SELECT id, creator_id, type, name, description, created_at, updated_at 
        FROM chatrooms 
        ${req.params.type === undefined ? `` : `WHERE type = ?`}`;
    sequelize.query(sql, {
        replacements: [req.params.type], type:sequelize.QueryTypes.SELECT
    }).then(all_chatrooms => {
        if (all_chatrooms.length === 0) {
            sendErrorStatus(res, 404, "Database doesn't have any chatrooms", "NOT_EXIST");
        } else {
            res.status(200).json(all_chatrooms);
        }
    }).catch((err)=>{
        sendErrorStatus(res, 500, `Internal Server Error: ${err}`, "SERVER_ERROR");
    })
}

/*-----------------SEE A CHATROOM-----------------*/
// if its not a public chatroom check if the user is a participant in it
exports.findOne = (req, res) => {
    let sql =  
        `SELECT id, creator_id, type, name, description, created_at, updated_at 
        FROM chatrooms
        WHERE id = ?`;
    sequelize.query(sql, {
        replacements: [req.params.id], type:sequelize.QueryTypes.SELECT
    }).then(user => {
        if (user.length === 0) {
            sendErrorStatus(res, 404, `Chatroom with the id ${req.params.id} doesn't exist`, "NOT_EXIST");
        } else {
            res.status(200).json(user[0]);
        }
    }).catch((err)=>{
        sendErrorStatus(res, 500, `Internal Server Error: ${err}`, "SERVER_ERROR");
    })
}

/*-----------------UPDATE A USER-----------------*/
exports.updateOne = (req,res) => {
    if(req.user[0].id == req.params.id){
        //check if is a valid email adress with regulaar expressions
        if(req.body.email === undefined || validateEmail(req.body.email)){
            /*Search for the current user object*/
            let sql =  
                `SELECT username, email, is_admin, is_active
                FROM users 
                WHERE id = ?`;
            sequelize.query(sql, {
                replacements: [req.params.id], type:sequelize.QueryTypes.SELECT
            }).then(result => {
                if (result.length > 0) {
                    /*hashed password sent, if nothing is sent in the req.body.password it simply doesn't send it, so the password stays hashed as before*/
                    reqs.bcrypt.genSalt(reqs.saltRounds, (err, salt) => {
                        reqs.bcrypt.hash(req.body.password, salt, (err, hash) => {
                            //created general function to update user
                            const updateUser = () => {
                                let current_user = result;
                                /*Added conditional in case the request body doesnt send all the users information, in the case of a info not being given it sends the same info that was already in the db*/
                                let changed_user = {
                                    id         : req.params.id,
                                    username   : req.body.username   !== undefined ? req.body.username   : current_user[0].username,
                                    email      : req.body.email      !== undefined ? req.body.email      : current_user[0].email,
                                    password   : req.body.password   !== undefined ? hash                : current_user[0].password,
                                    is_admin   : current_user[0].is_admin,
                                    is_active  : req.body.is_active  !== undefined ? req.body.is_active  : current_user[0].is_active
                                };
                                let sql = 
                                    `UPDATE users SET username = :username, email = :email, password = :password, is_admin = :is_admin, is_active = :is_active
                                    WHERE id = :id`;
                                sequelize.query(sql, {
                                    replacements: changed_user
                                }).then(result => {
                                    delete changed_user.password;
                                    res.status(200).json(changed_user);
                                }).catch((err)=>{
                                    sendErrorStatus(res, 500, `Internal Server Error: ${err}`, "SERVER_ERROR");
                                })           
                            }
                            //repeated username or email validation - only if new email or username info is sent
                            if(req.body.username !== undefined || req.body.email !== undefined){
                                let sql =  
                                    `SELECT username, email
                                    FROM users 
                                    WHERE (username = ? OR email = ?) AND id != ?`;
                                sequelize.query(sql, {
                                    replacements: [req.body.username, req.body.email, req.params.id], type:sequelize.QueryTypes.SELECT
                                }).then(repeated_users => {
                                    //error message in case of repeated username or email
                                    if (repeated_users.length !== 0) {
                                        let email = false;
                                        let username = false;
                                        repeated_users.forEach(repeated_user => {
                                            username = (repeated_user.username === req.body.username ? true : username);
                                            email = ( repeated_user.email === req.body.email  ? true : email);
                                        })   
                                        sendErrorStatus(res, 400, `${email && username ? "Username and email" : (email ? "Email" : "Username")} already exists`, "REPEATED_DATA");
                                    //if not repeated update user
                                    } else {
                                        updateUser();
                                    }
                                }).catch((err)=>{
                                    sendErrorStatus(res, 500, `Internal Server Error: ${err}`, "SERVER_ERROR");
                                })
                            } else {
                                //if not email or username info sent user updated without the extra query
                                updateUser();
                            }
                        });
                    });
                } else {
                    sendErrorStatus(res, 404, `User with the id ${req.params.id} doesn't exist in our database`, "NOT_EXIST");
                }
            }).catch((err) => {
                sendErrorStatus(res, 500, `Internal Server Error: ${err}`, "SERVER_ERROR");
            })
        } else {
            sendErrorStatus(res, 400, "Invalid email", "INVALID_EMAIL");
        }
    } else {
        sendErrorStatus(res, 403, "User not authorized to use this resource", "NO_AUTH");
    }
}

/*-----------------DELETE A USER-----------------*/
exports.deleteOne = (req, res) => {
    if(req.user[0].id == req.params.id || req.user[0].is_admin === 1){
        let sql =  
            `DELETE FROM users 
            WHERE id = ?`;
        sequelize.query( sql, {
            replacements: [req.params.id]
        }).then(deleted_user => {
            if (deleted_user[0].affectedRows === 0){
                sendErrorStatus(res, 404, `User with id ${req.params.id} doesn't exist`, "NOT_EXIST");
            } else {
                res.status(200).json(`Successfully deleted user with the id: ${req.params.id}`);                
            }
        }).catch((err) => {
            sendErrorStatus(res, 500, `Internal Server Error: ${err}`, "SERVER_ERROR");
        })
    } else {
        sendErrorStatus(res, 403, "User not authorized to use this resource", "NO_AUTH");
    }
}