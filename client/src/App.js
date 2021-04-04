import React, {useState} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
// import classes from './App.module.scss';
import Auth from './routes/Auth/Auth';
import Layout from './routes/Layout/Layout';
import axios from 'axios';

const App = () => {
	const [username, setUsername] = useState('');
	const [userId, setUserId] = useState('');
	const [token, setToken] = useState('');

	// Login
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

	// Register
	const register = (authUsername, authEmail, authPassword) => {
		const registrationData = {
			username   : authUsername,
			email      : authEmail,
			password   : authPassword
		}
		console.log(registrationData);
		axios.post('http://127.0.0.1:4001/users/', registrationData)
			.then(response => {
				// login user after registration
				console.log(response);
				checkAuth(authUsername, authPassword);
			}).catch((error) => {
				console.log(error);
			});
	}

	return (
		<BrowserRouter>
			<Switch>
				{/* if not auth - guard */}
				{	
					username 
					? <Route path="/" render={() => <Layout username={username} token={token} userId={userId}/>}/>
					: <Route path="/" exact  render={() => <Auth mode="signIn" onSubmitAction={(authUsername, authPassword) => checkAuth(authUsername, authPassword)}/>}/>
				}
				<Route path="/register" exact  render={() => <Auth mode="register" onSubmitAction={(authUsername, authEmail, authPassword) => register(authUsername, authEmail, authPassword)}/>}/>
				<Redirect from="/" to="/" />
			</Switch>
		</BrowserRouter>
	)
}

export default App;