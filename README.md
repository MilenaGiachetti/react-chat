# REACT CHAT WITH SOCKET.IO

## Contents

* [General information](#general-information)
* [Run locally](#run-locally)
<!-- * [Datos de usuarios](#datos-de-usuarios-admlins-y-no-admins)
* [Documentación](#open-api) -->

## General information
React Chat project to learn about WebSockets & Socket.io. To see the deployed version go to: [addlink](addlink).

### About the Client
Frontend build with React.

### About the Server
Backend build with Node.js, Express, MySQL & Socket.io

## Run locally

### 1. Clone repo

    git clone https://github.com/MilenaGiachetti/delilahresto_back.git

### 2. Server
#### 1- Node.js
This project is build Node.js, thereby it should be installed for the project to work if it's not currently. It can be downloaded and installed from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).  

#### 2- Install packages:
To install the dependencies run:
 
```bash
npm install
```  

-Make sure all commands for the server are made with the projects folder called 'server' as the current directory.

#### 3- XAMPP:
This project also requires XAMPP or another MySQL database management system. It can be downloaded from [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html).  
In XAMPP, the Apache & MySQL modules should be started to be able to make operations with the database. In case of having another system, make an equivalent action.  

#### 4- Configuration data for the database connection:  
The file **db_connection_data.js** inside of **server/app/config** contains the variables for the configuration of the database connection:

```json
conf_db_name  : 'react_chat',     // database name
conf_user     : 'root',           // user name
conf_password : '',               // password
conf_port     : '3306',           // port number
```
   
These variables can be changed from here if needed.

#### 5- Database installation:  
##### 5.0-Command to create the structure & tables of the db:

```bash
node app/db/0_db_structure.js
```  

-In case of already having a db called 'react_chat' (or with the given name -in case of changing the conf_db_name variable in the step 4) it will be eliminated in this step.

#### 6- Initialize the server
To initialize the server from the project folder called 'server' run:

```bash
    node server.js
```  

After following all the steps & running this command, it should log 'listening on port: 4001'.

### 3. Client
#### 1- Run React app
From the project folder called 'client' run:

    npm start     

The app can be seen in: [http://localhost:3000](http://localhost:3000).