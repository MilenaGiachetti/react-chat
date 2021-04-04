import {useEffect, useCallback, useState} from 'react';
import classes from './Layout.module.scss';
import logo from '../../logo.svg';
import {NavLink, Route} from 'react-router-dom';
import Chat from '../../Components/Chat/ChatContainer';
import axios from 'axios';


const ChatLayout = (props) => {
    const [chatrooms, setChatrooms] = useState([]);
    const [theme, setTheme] = useState("light");

    const getChats = useCallback(() => {
        const config = {
            headers: { Authorization: `Bearer ${props.token}` }
        };

		axios.get('http://127.0.0.1:4001/chatrooms/public', config)
			.then(response => {
                setChatrooms(response.data);
                console.log(response);
			}).catch((error) => {
				console.log(error);
			});
	},[props.token])

    const addChatHandler = () => {
        const config = {
            headers: { Authorization: `Bearer ${props.token}` }
        };
        const bodyParameters = {
            type: "public",
            name: "Nuevo chat",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam leo purus, varius id mi ut, mattis gravida ante. Cras nisi neque, mollis quis vehicula eu, volutpat sed metus."
        };
		axios.post('http://127.0.0.1:4001/chatrooms/', bodyParameters, config)
			.then(response => {
                console.log(response);
			}).catch((error) => {
				console.log(error);
			});
    }

    const toggleTheme = () => {
        var newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', theme)
    }

    useEffect(() => {
        getChats();
    }, [getChats])

	return (
        <div className={classes.Layout}>
            <header className={classes.Header}>
				<img src={logo} className={classes.Logo} alt="logo" />
				{/* <h1 className={classes.Title}>React Chat App with Socket.io</h1> */}
                <nav>
                    <ul>
                        <li><i className="fas fa-comment-alt"></i></li>
                        <li><i className="fas fa-cog"></i></li>
                        <li><button type="button" onClick={() => toggleTheme()}>{theme === "dark" ? <i className="fas fa-moon"  aria-hidden="true"></i> : <i className="fas fa-sun"  aria-hidden="true"></i>}</button></li>
                    </ul>
                </nav>
			</header>
            <main>
                <div className={classes.Nav}>
                    <div className={classes.title}>
                        <h2>Messages</h2>
                        <button className={classes.search}>
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                    <h3>PUBLIC CHATS</h3>
                    <ul>
                        {chatrooms.map( chat => {
                            return ( 
                                <li key={chat.id}>
                                    <NavLink className={classes.NavLink} activeClassName={classes.active} to={`/chats/${chat.id}`}>
                                        <img className={classes.chatImage} src="http://placeimg.com/40/40/animals" alt="User"></img>
                                        <span className={classes.chatContent}>
                                            <p className={classes.chatTitle}>{chat.name}<span className={classes.chatTime}>03:20</span></p>
                                            <p className={classes.chatMessage}>Lorem ipsum dolorem amit.</p>
                                        </span>
                                    </NavLink>
                                </li>)
                        })}
                    </ul>
                    {/* <h3>GROUPS</h3>
                    <div className={classes.emptyChats}>
                        <p>No chats yet</p>
                        <i className="fas fa-kiwi-bird">..</i>
                    </div>
                    <h3>PERSONAL</h3>
                    <div className={classes.emptyChats}>
                        <p>No chats yet</p>
                        <i className="fas fa-kiwi-bird">..</i>
                    </div> */}

                    <button onClick={addChatHandler} className={classes.addChat}><i className="fas fa-plus"></i></button>
                </div>
                <div className={classes.ChatContainer}>
                    <Route path="/chats/:chatId" render={() => <Chat username={props.username} key={window.location.pathname} userId={props.userId} token={props.token}/>}/>
                </div>
            </main>
        </div>
	)
}
export default ChatLayout;