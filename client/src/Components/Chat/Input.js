import React, {useState} from 'react';
import classes from './Input.module.scss';

const Input = (props) => {
	const [message, setMessage] = useState('');

	return (
		<form
			className={classes.Form}
			action="."
			onSubmit={e => {
				e.preventDefault()
				props.onSubmitMessage(message)
				setMessage('')
			}}
		>
			<input
				className={classes.Input}
				type="text"
				placeholder={'Enter message...'}
				value={message}
				onChange={e => setMessage( e.target.value )}
			/>
			<input 
				type="submit" 
				value='Send'
				className={classes.Button}
			/>
		</form>
	)
}
export default Input;