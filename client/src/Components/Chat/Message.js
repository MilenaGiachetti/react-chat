import React from 'react';
import classes from './Message.module.scss';


const Message = ({ sender, message, username }) => {
    return (
        
        <div className={username === sender ? classes.mine : classes.others}>
            <p>
                <strong>{sender}:</strong> {message}
            </p>
        </div>
    )
}

export default Message;