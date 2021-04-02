import React, {useState} from 'react';
import classes from './SignIn.module.scss';

const Register = (props) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

	return (
		<form
			action="."
			onSubmit={e => {
                e.preventDefault();
                props.onSubmitAction(username, password)
			}}
			className={classes.SignInCtn}
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
            </label>
            <label>Repeat password
                <input
                    type="password"
                    placeholder={'Repeat password'}
                    value={repeatPassword}
                    onChange={e => setRepeatPassword(e.target.value)}
                />
            </label>
			<input type="submit" value='Enter' />
            <a href="/">Already have an account? Sign in!</a>
		</form>
	)
}
export default Register;