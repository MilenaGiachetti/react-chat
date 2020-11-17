import React from 'react';
import classes from './Message.module.scss';


const Message = ({ sender, message, username }) => {
    return (
        <p className={username === sender ? classes.mine : classes.others}>
            <strong>{sender}:</strong> {message}
        </p>
    )
}

export default Message;