import { Box } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import ChatMessage from './ChatMessage';
import roomSocketAtom from '../../../atom/roomSocketAtom';
import IChatMessage from '../../../type/chatMessage';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatBox = () => {
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [chatHistory, setChatHistory] = useState<IChatMessage[]>([]);
    const socket = useRecoilValue(roomSocketAtom);
    const bottomAnchor = useRef<HTMLDivElement>(null);
    const { roomCode } = useParams();
    useEffect(() => {
        Axios.get('chat', { params: { id: roomCode } })
            .then((response) => {
                response.data.reverse();
                setChatHistory(response.data);
            })
            .catch((error) => console.error(error));
    }, [roomCode]);
    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            if (message['type'] === 'newMessage') setMessages([...messages, message['data']]);
        };
        socket.chat?.addEventListener('message', messageHandler);
        return () => socket.chat?.removeEventListener('message', messageHandler);
    }, [socket, messages]);
    useEffect(() => {
        if (bottomAnchor.current !== null) {
            bottomAnchor.current.scrollIntoView();
        }
    }, [messages]);
    return (
        <Box display="flex" flexDirection="column">
            {chatHistory.concat(messages).map((message, index) => (
                <ChatMessage name={message.name} message={message.message} color={message.color} key={index} />
            ))}
            <div ref={bottomAnchor} />
        </Box>
    );
};

export default ChatBox;
