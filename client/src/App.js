import React, {useState} from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import classes from './App.module.scss';
import Auth from './routes/Auth/Auth';
import ChatLayout from './routes/ChatLayout/ChatLayout';
import axios from 'axios';

const App = () => {
	const [username, setUsername] = useState('');

	const checkAuth = (authUsername, authPassword) => {
		setUsername(authUsername);
		const credentials = {
			username: authUsername,
			password: authPassword
		};
		// axios hace el stringify automáticamente de un js object a JSON data (hizo lo mismo en sentido contrario en el GET)
		axios.post('http://127.0.0.1:4001/users/login', credentials)
			.then(response => {
				console.log(response);
			});
	}

	return (
		<BrowserRouter>
			<header className={classes.Header}>
				<img src={logo} className={classes.Logo} alt="logo" />
				<h1 className={classes.Title}>React Chat App with Socket.io</h1>
			</header>
			<main className={classes.Main}>
				{/* Route Control */}
				<Switch>
					{/* if not auth - guard */}
					{	
						username 
						? <Route path="/" render={() => <ChatLayout username={username}/>}/>
						: <Route path="/" exact  render={() => <Auth onSubmitAction={(authUsername, authPassword) => checkAuth(authUsername, authPassword)}/>}/>
					}
					<Redirect from="/" to="/" />
				</Switch>

			</main>
			<footer className={classes.Footer}></footer>
		</BrowserRouter>
	)
}

export default App;