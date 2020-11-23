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
                <button onClick={addChatHandler}>Add Chat</button>
            </nav>
            <div className={classes.ChatContainer}>
                <Route path="/chats/:chatId" render={() => <Chat username={props.username} key={window.location.pathname}/>}/>
            </div>
        </section>
	)
}
export default ChatLayout;