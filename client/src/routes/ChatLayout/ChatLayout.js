import {useEffect, useCallback, useState} from 'react';
import classes from './ChatLayout.module.scss';
import {NavLink, Route} from 'react-router-dom';
import Chat from '../../Components/Chat/Chat';
import axios from 'axios';


const ChatLayout = (props) => {
    const [chatrooms, setChatrooms] = useState([]);

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

    useEffect(() => {
        getChats();
    }, [getChats])

	return (
        <section className={classes.ChatLayout}>
            <nav className={classes.Nav}>
                <ul>
                    {chatrooms.map( chat => {
                        return <li key={chat.id}><NavLink className={classes.NavLink} to={`/chats/${chat.name}`}>{chat.name}</NavLink></li>
                    })}
                </ul>
            </nav>
            <div className={classes.ChatContainer}>
                <Route path="/chats/:chatId" render={() => <Chat username={props.username} key={window.location.pathname}/>}/>
            </div>
        </section>
	)
}
export default ChatLayout;