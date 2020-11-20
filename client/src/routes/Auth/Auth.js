import classes from './Auth.module.scss';
import SignIn from '../../Components/SignIn/SignIn';

const Auth = (props) => {
	return (
        <section className={classes.Auth}>
            <SignIn onSubmitAction={(authUsername, authPassword) => props.onSubmitAction(authUsername, authPassword)}/>
        </section>
	)
}
export default Auth;