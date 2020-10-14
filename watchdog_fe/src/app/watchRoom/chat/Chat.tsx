import { Box } from '@material-ui/core';
import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';

import ChatBox from './ChatBox';
import ChatForm from './ChatForm';
import { ChatMessageData } from './ChatMessage';
import { baseUrl, wsProtocol } from '../../../util/urlResolver';

const Chat = () => {
    const [socket, setSocket] = useState<WebSocket>();
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [name, setName] = useState<string>('');
    const [color, setColor] = useState<string>('');
    useEffect(() => {
        const ws = new WebSocket(`${baseUrl(wsProtocol)}/ws/chat/lol/`);
        ws.onopen = () => {
            setSocket(ws);
        };
        return () => ws.close();
    }, []);
    useEffect(() => {
        if (socket) {
            const messageHandler = (event: MessageEvent) => {
                const message = JSON.parse(event.data);
                if (message['type'] === 'newMessage') {
                    setMessages(
                        produce(messages, (draft) => {
                            draft.push(message['data']);
                        })
                    );
                }
            };
            socket.addEventListener('message', messageHandler);
            return () => socket.removeEventListener('message', messageHandler);
        }
    }, [socket, messages]);
    useEffect(() => {
        if (name.length === 0) {
            let newName = window.localStorage.getItem('watchdogChatterName');
            if (newName) {
                setName(newName);
            } else {
                newName = uniqueNamesGenerator({
                    dictionaries: [adjectives, animals],
                    separator: ' ',
                    style: 'capital',
                });
                window.localStorage.setItem('watchdogChatterName', newName);
                setName(newName);
            }
        }
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            let newColor = window.localStorage.getItem('watchdogChatterColor');
            if (newColor) {
                setColor(newColor);
            } else {
                newColor = `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')}`;
                window.localStorage.setItem('watchdogChatterColor', newColor);
                setColor(newColor);
            }
        }
    }, [name, color]);
    return (
        <Box display="flex" flexDirection="column" height={window.innerHeight} width="300px">
            <Box flexGrow={2} maxHeight="100%" style={{ overflowY: 'scroll' }}>
                <ChatBox messages={messages} />
            </Box>
            <ChatForm
                sendFn={(message) => {
                    if (socket) {
                        socket.send(JSON.stringify({ type: 'chat.newMessage', data: { name, message, color } }));
                    }
                }}
            />
        </Box>
    );
};

export default Chat;
