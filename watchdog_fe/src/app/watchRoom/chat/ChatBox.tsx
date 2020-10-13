import { Box } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import ChatMessage, { ChatMessageData } from './ChatMessage';

interface ChatBoxProps {
    messages: ChatMessageData[];
}

const ChatBox: FunctionComponent<ChatBoxProps> = ({ messages }) => {
    return (
        <Box display="flex" flexDirection="column">
            {messages.map((message, index) => (
                <ChatMessage name={message.name} message={message.message} color={message.color} key={index} />
            ))}
        </Box>
    );
};

export default ChatBox;
