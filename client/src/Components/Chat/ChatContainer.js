import React, {useEffect, useState, useRef, Fragment, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import MessageInputGroup from './MessageInputGroup/MessageInputGroup';
import Message from './Message/Message';
import { connect } from 'react-redux';
import classes from './ChatContainer.module.scss';
import { io } from 'socket.io-client';
import axios from 'axios';


const URL = 'http://127.0.0.1:4001';

const Chat = (props) => {
	const [messages, setMessages] = useState([]);
		
	// create new websocket connection
	// leer mas https://www.grapecity.com/blogs/moving-from-react-components-to-react-hooks
	const socket = useRef(io(URL, {transports: ['websocket']}));
	const params = useParams();

	const getChatMessages = useCallback(() => {
        const config = {
            headers: { Authorization: `Bearer ${props.token}` }
        };
		axios.get(`http://127.0.0.1:4001/messages/${params.chatId}`, config)
			.then(response => {
				console.log(response.data);
				let initialMessages = response.data
				setMessages([...initialMessages]);
			}).catch((error) => {
				console.log(error);
			});
	},[props.token, params.chatId])
	
	useEffect(() => {
		getChatMessages();

		socket.current.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log('connected');
		}

		// socket.current.emit('send_user_id', props.userId);
		socket.current.emit('join_chat', params.chatId);
		
		// Listens for incoming messages
		socket.current.on('new_chat_message', (evt) => {
			console.log(evt);
			// on receiving a message, add it to the list of messages
			const message = JSON.parse(evt);
			addMessage(message);
		});

	
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

		let socketRef = socket.current;
		// ADD CALLBACK TO THE USEEFFECT TO CLEAN SUBSCRIPTION TO SOCKET
		return () => {
			socketRef.emit('leave_chat', params.chatId);
		};
	}, [params.chatId, getChatMessages]);

	const addMessage = message => {
		setMessages(prevMessages => ([message, ...prevMessages]));
	}

	const submitMessage = messageString => {
		// on submitting the ChatInput form, send the message, add it to the list and reset the input
		const message = { sender: props.username, chatroom_id: params.chatId, content: messageString, sender_id: props.userId, message_type: 'text'};
		socket.current.emit('new_chat_message', JSON.stringify(message));
	}

	return (
		<Fragment>
			<div className={classes.MessagesContainer}>
				{messages.map((message, index) =>
					<Message
						key={index}
						message={message.content}
						sender={message.sender}
						userId={props.userId}
						senderId={message.sender_id}
					/>
				)}
			</div>
			<MessageInputGroup
				className={classes.textInput}
				socket={socket}
				onSubmitMessage={messageString => submitMessage(messageString)}
			/>
		</Fragment>
	)
}

const mapStateToProps = state => {
	return {
		token: state.token,
        userId: state.userId,
        username: state.username

	};
};

export default connect(mapStateToProps)(Chat);