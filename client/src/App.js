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
			<Switch>
				{/* if not auth - guard */}
				{	
					username 
					? <Route path="/" render={() => <Layout username={username} token={token} userId={userId}/>}/>
					: <Route path="/" exact  render={() => <Auth onSubmitAction={(authUsername, authPassword) => checkAuth(authUsername, authPassword)}/>}/>
				}
				<Redirect from="/" to="/" />
			</Switch>
		</BrowserRouter>
	)
}

export default App;