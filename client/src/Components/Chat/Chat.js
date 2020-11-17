import React, {useEffect, useState, useRef} from 'react';
import ChatInput from './Input';
import ChatMessage from './Message';
import { io } from 'socket.io-client';

const URL = 'http://127.0.0.1:4001';

const Chat = () => {
	const [name, setName] = useState('name');
	const [messages, setMessages] = useState([]);
		
	// leer mas https://www.grapecity.com/blogs/moving-from-react-components-to-react-hooks

	// create new websocket connection
	const ws = useRef(io(URL, {transports: ['websocket']}));
	
	useEffect(() => {
		ws.current.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log('connected');
		}

		// Listens for incoming messages
		ws.current.on('chat message', (evt) => {
			console.log(evt);
			// on receiving a message, add it to the list of messages
			const message = JSON.parse(evt);
			addMessage(message);
		});
	
		// ws.current.onmessage = evt => {
		// 	const message = JSON.parse(evt.data);
		// 	addMessage(message);
		// }
	
		ws.current.onerror = error => {
			console.log(error);
		}

		ws.current.onclose = (event) => {
			console.log('disconnected');
			if (event.wasClean) {
				alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
			} else {
				// e.g. server process killed or network down
				// event.code is usually 1006 in this case
				alert('[close] Connection died');
			}
			// automatically try to reconnect on connection loss ?
			// ws = useRef(new WebSocket(URL));
		}
	}, []);

	const addMessage = message => {
		setMessages(prevMessages => ([message, ...prevMessages]));
	}

	const submitMessage = messageString => {
		// on submitting the ChatInput form, send the message, add it to the list and reset the input
		const message = { name: name, message: messageString };
		ws.current.emit('chat message', JSON.stringify(message));
		// addMessage(message);
		console.log('submitmessage');
	}

	return (
		<div>
			<label htmlFor="name">
				Name:&nbsp;
				<input
					type="text"
					id={'name'}
					placeholder={'Enter your name...'}
					value={name}
					onChange={e => setName(e.target.value)}
				/>
			</label>
			<ChatInput
				ws={ws}
				onSubmitMessage={messageString => submitMessage(messageString)}
			/>
			{messages.map((message, index) =>
				<ChatMessage
					key={index}
					message={message.message}
					name={message.name}
				/>
			)}
		</div>
	)
}

export default Chat;