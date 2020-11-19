import classes from './Login.module.scss';
import SignIn from '../../Components/SignIn/SignIn';

const Login = (props) => {
	return (
        <section className={classes.Login}>
            <SignIn onSubmitAction={(newUsername) => props.onSubmitAction(newUsername)}/>
        </section>
	)
}
export default Login;