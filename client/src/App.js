import React, {useState} from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import classes from './App.module.scss';
import Auth from './routes/Auth/Auth';
import ChatLayout from './routes/ChatLayout/ChatLayout';
import axios from 'axios';

const App = () => {
	const [username, setUsername] = useState('');
	const [userId, setUserId] = useState('');
	const [token, setToken] = useState('');
	// userId
	const checkAuth = (authUsername, authPassword) => {
		const credentials = {
			username: authUsername,
			password: authPassword
		};
		axios.post('http://127.0.0.1:4001/users/login', credentials)
			.then(response => {
				setUserId(response.data.user_id);
				console.log(response.data.token);
				setToken(response.data.token);
				setUsername(authUsername);
			}).catch((error) => {
				console.log(error);
			});
	}

	return (
		<BrowserRouter>
			{/* <header className={classes.Header}>
				<img src={logo} className={classes.Logo} alt="logo" />
				<h1 className={classes.Title}>React Chat App with Socket.io</h1>
			</header> */}
			<main className={classes.Main}>
				{/* Route Control */}
				<Switch>
					{/* if not auth - guard */}
					{	
						username 
						? <Route path="/" render={() => <ChatLayout username={username} token={token} userId={userId}/>}/>
						: <Route path="/" exact  render={() => <Auth onSubmitAction={(authUsername, authPassword) => checkAuth(authUsername, authPassword)}/>}/>
					}
					<Redirect from="/" to="/" />
				</Switch>

			</main>
			{/* <footer className={classes.Footer}></footer> */}
		</BrowserRouter>
	)
}

export default App;