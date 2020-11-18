import React, {useState} from 'react';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import logo from './logo.svg';
import classes from './App.module.scss';
import Chat from './Components/Chat/Chat';
import SignIn from './Components/SignIn/SignIn';

const App = () => {
	const [username, setUsername] = useState('');

	return (
		<BrowserRouter>
		<div className={classes.App}>
			<header className={classes.AppHeader}>
				<img src={logo} className={classes.AppLogo} alt="logo" />
				<h1 className={classes.AppTitle}>React Chat App with Socket.io</h1>
			</header>
			<div className={classes.Body}>
				{username ?
					null
					:<SignIn onSubmitAction={(newUsername) => setUsername(newUsername)}/>
				}
				{username ?
					<div>
						<li><NavLink to="/chats/cat">Cat</NavLink></li>
						<li><NavLink to="/chats/dog">Dog</NavLink></li>
					</div>
					:null
				}

				<Route path="/" exact  render={() => <h1>Chat to be</h1>}/>
				<Route path="/chats/:chatId" render={() => <Chat username={username}/>}/>
				
			</div>
		</div>
		</BrowserRouter>
	)
}

export default App;