import React from 'react';
import classes from './Message.module.scss';


const Message = ({ sender, message, userId, senderId }) => {
    return (
        
        <div className={userId === senderId ? `${classes.message} ${classes.user}` : `${classes.message} ${classes.others}`}>
            <p>
                <strong>{sender}:</strong> {message}
            </p>
        </div>
    )
}

export default Message;