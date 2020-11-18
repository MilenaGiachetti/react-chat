import React, {useEffect, useState, useRef} from 'react';
import Input from './Input';
import Message from './Message';
import classes from './Chat.module.scss';
import { io } from 'socket.io-client';

const URL = 'http://127.0.0.1:4001';

const Chat = (props) => {
	// const [name, setName] = useState('name');
	const [messages, setMessages] = useState([]);
		
	// leer mas https://www.grapecity.com/blogs/moving-from-react-components-to-react-hooks

	// create new websocket connection
	const socket = useRef(io(URL, {transports: ['websocket']}));
	
	useEffect(() => {
		socket.current.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log('connected');
		}

		
		// Listens for incoming messages
		socket.current.on('new_chat_message', (evt) => {
			console.log(evt);
			// on receiving a message, add it to the list of messages
			const message = JSON.parse(evt);
			addMessage(message);
		});
		
		socket.current.emit('join_chat', props.room);
		// socket.current.onmessage = evt => {
		// 	const message = JSON.parse(evt.data);
		// 	addMessage(message);
		// }
	
		socket.current.onerror = error => {
			console.log(error);
		}

		socket.current.onclose = (event) => {
			console.log('disconnected');
			if (event.wasClean) {
				alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
			} else {
				// e.g. server process killed or network down
				// event.code is usually 1006 in this case
				alert('[close] Connection died');
			}
			// automatically try to reconnect on connection loss ?
			// socket = useRef(new WebSocket(URL));
		}
	}, [props.room]);

	const addMessage = message => {
		setMessages(prevMessages => ([message, ...prevMessages]));
	}

	const submitMessage = messageString => {
		// on submitting the ChatInput form, send the message, add it to the list and reset the input
		const message = { sender: props.username, message: messageString };
		socket.current.emit('new_chat_message', JSON.stringify(message));
		// addMessage(message);
		console.log('submitmessage');
	}

	return (
		<div className={classes.Chat}>
			<div className={classes.MessagesContainer}>
				{messages.map((message, index) =>
					<Message
						key={index}
						message={message.message}
						sender={message.sender}
						username={props.username}
					/>
				)}
			</div>
			<Input
				className={classes.textInput}
				socket={socket}
				onSubmitMessage={messageString => submitMessage(messageString)}
			/>
		</div>
	)
}

export default Chat;