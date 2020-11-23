/*---------------------------------------------CHATS--------------------------------------------*/
module.exports = app => {
    /*-----------------REQUIREMENTS-----------------*/
    const chatrooms = require("../controllers/chatrooms_controllers");
    const middlewares = require("../middlewares/middlewares");
    let router = require("express").Router();
  
    /*-----------------ADD A CHATROOM-----------------*/
    router.post("/", middlewares.authenticateUser, chatrooms.addOne);

    /*-----------------SEE ALL CHATROOMS BY TYPE-----------------*/
    router.get("/:type?", middlewares.authenticateUser, chatrooms.findAll)
    // options: public, group, private, empty (to see all)

    /*-----------------SEE ALL CHATROOMS BY USER-----------------*/

    /*-----------------SEE A CHATROOM-----------------*/
    router.get("/:id", middlewares.authenticateUser, chatrooms.findOne);

    /*-----------------UPDATE A CHATROOM-----------------*/
    router.put("/:id", middlewares.authenticateUser, chatrooms.updateOne);

    /*-----------------DELETE A CHATROOM-----------------*/
    router.delete("/:id", middlewares.authenticateUser, chatrooms.deleteOne);

    app.use("/chatrooms", router);
};