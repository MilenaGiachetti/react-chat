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
			<label>Username or email
				<input
					type="text"
					placeholder={'Enter username or email'}
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
			</label>
			<label>Password
				<input
					type="password"
					placeholder={'Enter password'}
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<input type="submit" value='Enter' />
			</label>
			<a>Don't have an account? Sign up</a>
		</form>
	)
}
export default SignIn;