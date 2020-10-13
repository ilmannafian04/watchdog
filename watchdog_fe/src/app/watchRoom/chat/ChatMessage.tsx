import { Box } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

export interface ChatMessageData {
    name: string;
    message: string;
    color: string;
}

const ChatMessage: FunctionComponent<ChatMessageData> = ({ name, message, color }) => {
    return (
        <span>
            <Box component={'span'} color={color}>
                <b>{name}</b>
            </Box>
            : {message}
        </span>
    );
};

export default ChatMessage;
