import { Box } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useRef } from 'react';

import ChatMessage, { ChatMessageData } from './ChatMessage';

interface ChatBoxProps {
    messages: ChatMessageData[];
}

const ChatBox: FunctionComponent<ChatBoxProps> = ({ messages }) => {
    const bottomAnchor = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (bottomAnchor.current !== null) {
            bottomAnchor.current.scrollIntoView();
        }
    }, [messages]);
    return (
        <Box display="flex" flexDirection="column">
            {messages.map((message, index) => (
                <ChatMessage name={message.name} message={message.message} color={message.color} key={index} />
            ))}
            <div ref={bottomAnchor} />
        </Box>
    );
};

export default ChatBox;
