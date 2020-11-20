/*---------------------------------------------REQUIREMENTS--------------------------------------------*/
const sequelize = require('../config/db_config');
const reqs = require('../config/config');

const validateEmail = (email) => {
    let emailregex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailregex.test(email);
}

const sendErrorStatus = (res, status, message) => {
    res.status(status).json({
        "error":{
            "status": status,
            "message": message
        }
    })
};
// sendErrorStatus(res, status, message);

/*---------------------------------------------USERS--------------------------------------------*/
/*-----------------ADD A USER-----------------*/
exports.addOne = (req,res) => {
    let missingInfo = [];
    req.body.username   !== undefined ? '' : missingInfo.push('username');
    req.body.email      !== undefined ? '' : missingInfo.push('email');
    req.body.password   !== undefined ? '' : missingInfo.push('password');
    
    if (missingInfo.length === 0) {
        //check if is a valid email adress with regulaar expressions
        if(validateEmail(req.body.email)){
            let sql =  
                `SELECT username, email, is_admin 
                FROM users 
                WHERE username = ? OR email = ?`;
            sequelize.query(sql, {
                replacements: [req.body.username, req.body.email], type:sequelize.QueryTypes.SELECT
            }).then(repeated_users => {
                if (repeated_users.length === 0) {
                    /*hashing password before sending information*/
                    reqs.bcrypt.genSalt(reqs.saltRounds, (err, salt) => {
                        reqs.bcrypt.hash(req.body.password, salt, (err, hash) => {
                            let user = {
                                id         : null,
                                username   : req.body.username,
                                email      : req.body.email,
                                password   : hash,
                                is_admin   : 0,
                                is_active  : 0,
                                created_at : null,
                                updated_at : null
                            };
                            let sql = `INSERT INTO users VALUES (:id, :username, :email, :password, :is_admin, :is_active, :created_at, updated_at)`;
                            sequelize.query(sql, {
                                replacements: user
                            }).then(result => {
                                user.id = result[0];
                                delete user.password;
                                res.status(200).json(user);
                                /*return the token so it can be already logged in ?*/
                            }).catch((err)=>{
                                sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
                            })
                        });
                    });
                } else {
                    //error handling when there is/are repeated username and/or email
                    let email = false;
                    let username = false;
                    //checking what is repeated
                    repeated_users.forEach(repeated_user => {
                        email = (repeated_user.email === req.body.email ? true : email);
                        username = (repeated_user.username === req.body.username ? true : username);
                    });
                    //sending error message
                    sendErrorStatus(res, 400, `Sent ${email && username ? 'username and email' : (email ? 'email' : 'username')} already exists`);
                }
            }).catch((err) => {
                sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
            })
        } else {
            sendErrorStatus(res, 400, "Invalid Email");
        }
    } else {
        sendErrorStatus(res, 400, `Missing data: ${missingInfo.join(" - ")}`);
    }
}

/*-----------------ADD AN ADMIN-----------------*/
exports.addAdmin = (req,res) => {
    //error message in case of missing required info 422 or 400?
    let missingInfo = [];
    req.body.username   !== undefined ? '' : missingInfo.push('username');
    req.body.email      !== undefined ? '' : missingInfo.push('email');
    req.body.password   !== undefined ? '' : missingInfo.push('password');
    
    if (missingInfo == '') {
        //check if is a valid email adress with regulaar expressions
        if(validateEmail(req.body.email)){
            let sql =  
                `SELECT username, email, is_admin 
                FROM users 
                WHERE username = ? OR email = ?`;
            sequelize.query(sql, {
                replacements: [req.body.username, req.body.email], type:sequelize.QueryTypes.SELECT
            }).then(repeated_users => {
                if (repeated_users.length === 0) {
                    /*hashing password before sending information*/
                    reqs.bcrypt.genSalt(reqs.saltRounds, (err, salt) => {
                        reqs.bcrypt.hash(req.body.password, salt, (err, hash) => {
                            let user = {
                                id         : null,
                                username   : req.body.username,
                                email      : req.body.email,
                                password   : hash,
                                is_admin   : 1,
                                is_active  : 0,
                                created_at : null,
                                updated_at : null
                            };
                            let sql = `INSERT INTO users VALUES (:id, :username, :email, :password, :is_admin, :is_active, :created_at, :updated_at)`;
                            sequelize.query(sql, {
                                replacements: user
                            }).then(result => {
                                user.id = result[0];
                                delete user.password;
                                res.status(200).json(user);
                                /*it should also return the token so it can be already logged in ?*/
                            }).catch((err) => {
                                sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
                            })
                        });
                    });
                } else {
                    //error handling when there is/are repeated username and/or email
                    let email = false;
                    let username = false;
                    //checking what is repeated
                    repeated_users.forEach(repeated_user => {
                        email += (repeated_user.email === req.body.email ? true : email);
                        username += (repeated_user.username === req.body.username ? true : username);
                    });
                    //sending error message
                    sendErrorStatus(res, 400, `Sent ${email && username ? 'username and email' : (email ? 'email' : 'username')} already exists`);
                }
            }).catch((err)=>{
                sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
            })
        } else {
            sendErrorStatus(res, 400, "Invalid Email");
        }
    } else {
        sendErrorStatus(res, 400, `Missing data: ${missingInfo.join(" - ")}`);
    }
}

/*-----------------SEE ALL USERS-----------------*/
exports.findAll = (req,res) => {
    let sql = `SELECT id, username, email, is_admin, is_active, created_at, updated_at FROM users`;
    sequelize.query(sql, {
        type:sequelize.QueryTypes.SELECT
    }).then(all_users => {
        if (all_users.length === 0) {
            sendErrorStatus(res, 404, "Database doesn't have any users");
        } else {
            res.status(200).json(all_users);
        }
    }).catch((err)=>{
        sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
    })
}

/*-----------------SEE A USER-----------------*/
exports.findOne = (req, res) => {
    if(req.user[0].id == req.params.id || req.user[0].is_admin === 1){
        let sql =  
            `SELECT id, username, email, is_admin, is_active, created_at, updated_at  
            FROM users 
            WHERE id = ?`;
        sequelize.query(sql, {
            replacements: [req.params.id], type:sequelize.QueryTypes.SELECT
        }).then(user => {
            if (user.length === 0) {
                sendErrorStatus(res, 404, `User with the id ${req.params.id} doens't exist`);
            } else {
                res.status(200).json(user[0]);
            }
        }).catch((err)=>{
            sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
        })
    } else {
        sendErrorStatus(res, 403, "User not authorized to use this resource"); 
    }
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
                                    sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
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
                                        sendErrorStatus(res, 400, `Sent ${email && username ? 'username and email' : (email ? 'email' : 'username')} already exists`);
                                    //if not repeated update user
                                    } else {
                                        updateUser();
                                    }
                                }).catch((err)=>{
                                    sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
                                })
                            } else {
                                //if not email or username info sent user updated without the extra query
                                updateUser();
                            }
                        });
                    });
                } else {
                    sendErrorStatus(res, 404, `User with the id ${req.params.id} doesn't exist in our database`);
                }
            }).catch((err) => {
                sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
            })
        } else {
            sendErrorStatus(res, 400, "Invalid email");
        }
    } else {
        sendErrorStatus(res, 403, "User not authorized to use this resource");
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
                sendErrorStatus(res, 404, `User with id ${req.params.id} doesn't exist`);
            } else {
                res.status(200).json(`Successfully deleted user with the id: ${req.params.id}`);                
            }
        }).catch((err) => {
            sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
        })
    } else {
        sendErrorStatus(res, 403, "User not authorized to use this resource");
    }
}

/*---------------------------------------------USER LOG IN--------------------------------------------*/
exports.login = (req,res) => {
    let missingInfo = [];
    req.body.username   !== undefined ? '' : missingInfo.push('username');
    req.body.email      !== undefined ? '' : missingInfo.push('email');
    req.body.password   !== undefined ? '' : missingInfo.push('password');

    if (missingInfo.length <= 1 && missingInfo[0] !== 'password') {
        const jwtPass = reqs.jwtPass;
        let sql =  
            `SELECT * FROM users 
            WHERE (username = :username OR email = :email)`;
        sequelize.query(sql, {
            replacements: {username : req.body.username , email: req.body.username}, type:sequelize.QueryTypes.SELECT
        }).then(result => {
            if(result.length !== 0){
                async function checkPass(){
                    const match = await reqs.bcrypt.compare(req.body.password, result[0].password);
                    /*error management*/
                    if (match){
                        /*token created and sent when correct data is given*/
                        let user_id = result[0].id;
                        const token = reqs.jwt.sign({
                            user_id,
                        }, jwtPass);
                        res.status(200).json({token: token, user_id: user_id});
                    } else {
                        sendErrorStatus(res, 401, "Incorrect user credentials");
                    }
                }
                checkPass();
            } else {
                sendErrorStatus(res, 404, "No user with these credentials");
            }
        }).catch((err) => {
            sendErrorStatus(res, 500, `Internal Server Error: ${err}`);
        })
    } else {
        sendErrorStatus(res, 403, `the request is missing the following information: ${missingInfo.join(' - ')}`);
    }
}