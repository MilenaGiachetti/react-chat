import React from 'react';
import logo from './logo.svg';
import classes from './App.module.scss';
import Chat from './Components/Chat/Chat';

const App = () => {
	return (
		<div className={classes.App}>
			<header className={classes.AppHeader}>
				<img src={logo} className={classes.AppLogo} alt="logo" />
				<h1 className={classes.AppTitle}>React Chat App with Socket.io</h1>
			</header>
			<Chat />
		</div>
	)
}

export default App;