import React, {useState} from 'react';
import classes from './SignIn.module.scss';

const SignIn = (props) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	return (
		<form
			action="."
			onSubmit={e => {
                e.preventDefault();
                props.onSubmitAction(username, password)
			}}
			className={classes.SignInCtn}
		>
			<p>Enter username:</p>
			<input
				type="text"
				placeholder={'Enter username or email'}
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				type="password"
				placeholder={'Enter password'}
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<input type="submit" value='Enter' />
		</form>
	)
}
export default SignIn;