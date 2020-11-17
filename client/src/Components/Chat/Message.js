import React from 'react';

const Message = ({ name, message }) => {
    return (
        <p>
            <strong>{name}</strong> {message}
        </p>
    )
}

export default Message;