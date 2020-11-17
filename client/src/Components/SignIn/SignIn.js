import React, {useState} from 'react';

// import PropTypes from 'prop-types'

const SignIn = (props) => {
	// static propTypes = {
	// 	onSubmitMessage: PropTypes.func.isRequired,
	// }
	const [newUsername, setNewUsername] = useState('');

	return (
		<form
			action="."
			onSubmit={e => {
                e.preventDefault();
                props.onSubmitAction(newUsername)
			}}
		>
			<input
				type="text"
				placeholder={'Enter message...'}
				value={newUsername}
				onChange={e => setNewUsername( e.target.value )}
			/>
			<input type="submit" value='Enter' />
		</form>
	)
}
export default SignIn;