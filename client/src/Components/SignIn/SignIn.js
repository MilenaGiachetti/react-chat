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

	let formClasses = [classes.SignInCtn];
	if(props.isLoading) {
		formClasses = [classes.SignInCtn, classes.Loading];
	}

	return (
		<form
			action="."
			onSubmit={submitHandler}
			className={formClasses.join(" ")}
		>
			<label>Username or email
				<input
					type="text"
					placeholder={'Enter username or email'}
					value={username}
					onChange={e => setUsername(e.target.value)}
					disabled={props.isLoading}
				/>
			</label>
			<label>Password
				<input
					type="password"
					placeholder={'Enter password'}
					value={password}
					onChange={e => setPassword(e.target.value)}
					disabled={props.isLoading}
				/>
				<input type="submit" value='Enter' disabled={props.isLoading}/>
			</label>
			<a href="/register">Don't have an account? Sign up</a>
			<div className={classes.Loader}></div>
		</form>
	)
}

const mapStateToProps = state => {
	return {
		isLoading: state.loading
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (userData, isSignUp) => dispatch(actions.auth(userData, isSignUp))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);