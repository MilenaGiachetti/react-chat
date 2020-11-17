import React, {useState} from 'react';

// import PropTypes from 'prop-types'

const Input = (props) => {
	// static propTypes = {
	// 	onSubmitMessage: PropTypes.func.isRequired,
	// }
	const [message, setMessage] = useState('');

	return (
		<form
			action="."
			onSubmit={e => {
				e.preventDefault()
				props.onSubmitMessage(message)
				setMessage('')
			}}
		>
			<input
				type="text"
				placeholder={'Enter message...'}
				value={message}
				onChange={e => setMessage( e.target.value )}
			/>
			<input type="submit" value={'Send'} />
		</form>
	)
}
export default Input;