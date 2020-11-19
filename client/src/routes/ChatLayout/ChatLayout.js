import classes from './ChatLayout.module.scss';
import { NavLink, Route } from 'react-router-dom';
import Chat from '../../Components/Chat/Chat';

const ChatLayout = (props) => {
	return (
        <section className={classes.ChatLayout}>
            <nav className={classes.Nav}>
                <ul>
                    <li><NavLink className={classes.NavLink} to="/chats/cat">Cat</NavLink></li>
                    <li><NavLink className={classes.NavLink} to="/chats/dog">Dog</NavLink></li>
                </ul>
            </nav>
            <div className={classes.ChatContainer}>
                <Route path="/chats/:chatId" render={() => <Chat username={props.username} key={window.location.pathname}/>}/>
            </div>
        </section>
	)
}
export default ChatLayout;