import React, {useState} from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
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
						<li><Link to="/cat">Cat</Link></li>
						<li><Link to="/dog">Dog</Link></li>
					</div>
					:null
				}

				<Route path="/" exact  render={() => <h1>Chat to be</h1>}/>
				<Route path="/cat" exact render={() => <Chat username={username} room='cat'/>}/>
				<Route path="/dog" exact  render={() => <Chat username={username} room='dog'/>}/>
{/* 
				{username ?
					<Chat username={username}/>
					:null
				} */}
			</div>
		</div>
		</BrowserRouter>
	)
}

export default App;