import React, {useState} from 'react';
import logo from './logo.svg';
import classes from './App.module.scss';
import Chat from './Components/Chat/Chat';
import SignIn from './Components/SignIn/SignIn';

const App = () => {
	const [username, setUsername] = useState('');

	return (
		<div className={classes.App}>
			<header className={classes.AppHeader}>
				<img src={logo} className={classes.AppLogo} alt="logo" />
				<h1 className={classes.AppTitle}>React Chat App with Socket.io</h1>
			</header>
			<SignIn onSubmitAction={(newUsername) => setUsername(newUsername)}/>
			{username ?
			<Chat username={username}/>
			:null
			}
		</div>
	)
}

export default App;