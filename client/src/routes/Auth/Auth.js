import classes from './Auth.module.scss';
import SignIn from '../../Components/SignIn/SignIn';
import Register from '../../Components/SignIn/Register';
import logo from '../../logo.svg';
import {Fragment} from 'react';


const Auth = (props) => {
	return (
        <Fragment>
            <header className={classes.Header}>
                <img src={logo} className={classes.Logo} alt="logo" />
                <h1 className={classes.Title}>React Chat App with Socket.io</h1>
            </header>
            <main className={classes.Auth}>
                {	
					props.mode === "signIn" 
					? <SignIn onSubmitAction={(authUsername, authPassword) => props.onSubmitAction(authUsername, authPassword)}/>
                    : <Register onSubmitAction={(authUsername, authEmail, authPassword) => props.onSubmitAction(authUsername, authEmail, authPassword)}/>
                }       
            </main>
            <footer className={classes.Footer}></footer>
        </Fragment>
	)
}
export default Auth;