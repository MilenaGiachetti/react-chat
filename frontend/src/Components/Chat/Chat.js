import React, {useEffect, useState, useRef} from 'react';
import ChatInput from './Input';
import ChatMessage from './Message';

const URL = 'ws://localhost:3030';

const Chat = () => {
	const [name, setName] = useState('name');
	const [messages, setMessages] = useState([]);
		
	// leer mas https://www.grapecity.com/blogs/moving-from-react-components-to-react-hooks

	const ws = useRef(new WebSocket(URL));
	
	useEffect(() => {
		ws.current.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log('connected');
		}
	
		ws.current.onmessage = evt => {
			// on receiving a message, add it to the list of messages
			const message = JSON.parse(evt.data);
			addMessage(message);
		}
	
		ws.current.onclose = () => {
			console.log('disconnected');
			// automatically try to reconnect on connection loss
			// whats the point of this??
			// this.setState({
			// 	ws: new WebSocket(URL),
			// })
		}
	}, []);

	const addMessage = message => {
		setMessages(prevMessages => ([message, ...prevMessages]));
	}

	const submitMessage = messageString => {
		// on submitting the ChatInput form, send the message, add it to the list and reset the input
		const message = { name: name, message: messageString };
		ws.current.send(JSON.stringify(message));
		addMessage(message);
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