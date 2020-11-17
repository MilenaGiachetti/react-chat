import React from 'react';
import classes from './Message.module.scss';


const Message = ({ name, message, username }) => {
    return (
        <p className={username === name ? classes.mine : classes.others}>
            <strong>{name}:</strong> {message}
        </p>
    )
}

export default Message;