import React, {useState} from 'react';
import classes from './SignIn.module.scss';

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
			className={classes.SignInCtn}
		>
			<p>Enter username:</p>
			<input
				type="text"
				placeholder={'Enter username...'}
				value={newUsername}
				onChange={e => setNewUsername( e.target.value )}
			/>
			<input type="submit" value='Enter' />
		</form>
	)
}
export default SignIn;