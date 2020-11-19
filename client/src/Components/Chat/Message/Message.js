import React from 'react';
import classes from './Message.module.scss';


const Message = ({ sender, message, username }) => {
    return (
        
        <div className={username === sender ? `${classes.message} ${classes.user}` : `${classes.message} ${classes.others}`}>
            <p>
                <strong>{sender}:</strong> {message}
            </p>
        </div>
    )
}

export default Message;