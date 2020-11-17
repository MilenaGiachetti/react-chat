import React from 'react';
import logo from './logo.svg';
import classes from './App.module.scss';
import Chat from './Components/Chat/Chat';

const App = () => {
	return (
		<div className={classes.App}>
			<header className={classes.AppHeader}>
				<img src={logo} className={classes.AppLogo} alt="logo" />
				<h1 className={classes.AppTitle}>React Chat App with webSocket</h1>
			</header>
			<Chat />
		</div>
	)
}

export default App;
// one on one chats, private group chats, public chats
// each person has a display name (make unique or not? - it should be to difficult impersonation) and an id (add people to individual and group chats with id or display name)
// show members currently in the chat groups (just total number)
// search bar for chat

// backend: 
// - users (id, name, password, xid (id + currenttime encriptado - p/cookie))
// - chats (id, type: individual, private, public; participants)
// - messages (id, user, content, chat id - chat it belongs to )