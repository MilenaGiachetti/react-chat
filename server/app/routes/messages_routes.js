/*---------------------------------------------MESSAGES--------------------------------------------*/
module.exports = app => {
    /*-----------------REQUIREMENTS-----------------*/
    const messages = require("../controllers/messages_controllers");
    const middlewares = require("../middlewares/middlewares");
    let router = require("express").Router();
  
    /*-----------------ADD A MESSAGE-----------------*/
    // router.post("/", middlewares.authenticateUser, messages.addOne);

    /*-----------------SEE ALL MESSAGES BY CHATROOM-----------------*/
    router.get("/:chatroom_id", middlewares.authenticateUser, messages.findAll)

    /*-----------------SEE A MESSAGE-----------------*/
    // router.get("/:id", middlewares.authenticateUser, messages.findOne);

    /*-----------------DELETE A MESSAGE-----------------*/
    // router.delete("/:id", middlewares.authenticateUser, messages.deleteOne);

    app.use("/messages", router);
};