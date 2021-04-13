import React, {useState} from 'react';
import classes from './SignIn.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

const SignIn = (props) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const submitHandler = (e) => {
		e.preventDefault();
		props.onAuth({username: username, password: password}, false)
	}

	return (
		<form
			action="."
			onSubmit={submitHandler}
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
			<a href="/register">Don't have an account? Sign up</a>
		</form>
	)
}

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (userData, isSignUp) => dispatch(actions.auth(userData, isSignUp))
	}
};

export default connect(null, mapDispatchToProps)(SignIn);