/*---------------------------------------------USERS--------------------------------------------*/
module.exports = app => {
    /*-----------------REQUIREMENTS-----------------*/
    const users = require("../controllers/users_controllers");
    const middlewares = require("../middlewares/middlewares");
    let router = require("express").Router();
  
    /*-----------------ADD A USER-----------------*/
    router.post('/', users.addOne);

    /*example of info to send in the body: // JSON
    {
        "username": "LukeSky",
        "email": "luke@sky.com",
        "password": "12341234"
    }
    */

   /*-----------------ADD AN ADMIN-----------------*/
   router.post('/admins', middlewares.authorizateUser, users.addAdmin);

    /*-----------------SEE ALL USERS-----------------*/
    router.get('/', middlewares.authorizateUser, users.findAll)

    /*-----------------SEE A USER-----------------*/
    router.get('/:id', middlewares.authenticateUser, users.findOne);

    /*-----------------UPDATE A USER-----------------*/
    router.put('/:id', middlewares.authenticateUser, users.updateOne);

    /*example of info to send in the body:
    {
        "username": "LukeSky2",
        "email": "luke2@sky.com",
        "password": "123412342"
    }
    {
        "email": "newluke@sky.com",
    }
    */

    /*-----------------DELETE A USER-----------------*/
    router.delete('/:id', middlewares.authenticateUser, users.deleteOne);

    /*---------------------------------------------USER LOG IN---------------------------------------------/add expiration to token*/
    router.post('/login', users.login)
    
    /*-----------------ROUTES EXAMPLE USING THE EXISTENT MIDDLEWARES(eliminate)-----------------*/
    //const middlewares = require("../middlewares/middlewares");
    /*router.get('/secure', middlewares.authenticateUser, (req, res)=> {
        res.send(`Esta es una pagina autenticada. Hola ${req.user[0].firstname}!`);
    })
    router.get('/adminonly', middlewares.authorizateUser, (req, res)=> {
        res.send(`Esta es una pagina que requiere autorizacion. Hola Admin!`);
    })*/

    app.use('/users', router);
};