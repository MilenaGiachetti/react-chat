import React, {useState} from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import classes from './App.module.scss';
import Login from './routes/Login/Login';
import ChatLayout from './routes/ChatLayout/ChatLayout';

const App = () => {
	const [username, setUsername] = useState('');

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
						: <Route path="/" exact  render={() => <Login onSubmitAction={(newUsername) => setUsername(newUsername)}/>}/>
					}
					<Redirect from="/" to="/" />
				</Switch>

			</main>
			<footer className={classes.Footer}></footer>
		</BrowserRouter>
	)
}

export default App;