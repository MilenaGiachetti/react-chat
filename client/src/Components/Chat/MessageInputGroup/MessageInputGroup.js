import React, {useState} from 'react';
import classes from './MessageInputGroup.module.scss';

const Input = (props) => {
	const [message, setMessage] = useState('');

	return (
		<form
			className={classes.Form}
			action="."
			onSubmit={e => {
				e.preventDefault()
				if(message !== '') {
					props.onSubmitMessage(message)
					setMessage('')
				}
			}}
		>
			<input
				className={classes.Input}
				type="text"
				required
				placeholder={'Enter message...'}
				value={message}
				onChange={e => setMessage( e.target.value )}
			/>
			<button
				type="submit" 
				className={classes.Button}
			>
				<i className="fas fa-paper-plane"></i>
			</button>
		</form>
	)
}
export default Input;