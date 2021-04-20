import React, {useState} from 'react';
import classes from './SignIn.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

const Register = (props) => {
	const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

    const submitHandler = (e) => {
		e.preventDefault();
		props.onAuth({username: username, password: password, email: email}, true)
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
            <label>Username
                <input
                    type="text"
                    placeholder={'Enter username'}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </label>
            <label>Email
                <input
                    type="email"
                    placeholder={'Enter email'}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
            </label>
            <label>Repeat password
                <input
                    type="password"
                    placeholder={'Repeat password'}
                    value={repeatPassword}
                    onChange={e => setRepeatPassword(e.target.value)}
                    disabled={props.isLoading}
                />
            </label>
			<input type="submit" value='Enter' disabled={props.isLoading}/>
            <a href="/">Already have an account? Sign in!</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);