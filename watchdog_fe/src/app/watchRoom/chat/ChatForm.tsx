import { Box, Button, TextField, Typography } from '@material-ui/core';
import Axios from 'axios';
import React, { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import roomSocketAtom from '../../../atom/roomSocketAtom';

const ChatForm = () => {
    const [message, setMessage] = useState<string>('');
    const socket = useRecoilValue(roomSocketAtom);
    const { roomCode } = useParams();
    const formRef = useRef<HTMLFormElement>(null);
    const messageChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (!/\n/.test(event.target.value)) {
            setMessage(event.target.value);
        }
    };
    const sendChat = () => {
        if (message.charAt(0) === '/') {
            let commandString = message.replace('/', '');
            const command = commandString.split(' ')[0];
            const argument = commandString.slice(commandString.indexOf(' ') + 1);
            const data = new FormData();
            data.append('id', roomCode);
            switch (command) {
                case 'changename':
                    data.append('name', argument);
                    Axios.post('watcher', data)
                        .then(() => {})
                        .catch((error) => console.error(error));
                    break;
                case 'changecolor':
                    data.append('color', argument);
                    Axios.post('watcher', data)
                        .then(() => {})
                        .catch((error) => console.error(error));
                    break;
                default:
            }
            setMessage('');
        } else if (message.length > 0) {
            socket.chat?.send(JSON.stringify({ type: 'newMessage', data: message }));
            setMessage('');
        }
    };
    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        sendChat();
    };
    const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            sendChat();
        }
    };
    return (
        <Box display="flex" flexDirection="column">
            <Typography variant="caption" style={{ color: 'grey' }}>
                "/changecolor #000000" to change color
            </Typography>
            <Typography variant="caption" style={{ color: 'grey' }}>
                "/changename new name" to change name
            </Typography>
            <form onSubmit={submitHandler} ref={formRef}>
                <Box display="flex">
                    <TextField
                        multiline
                        fullWidth
                        value={message}
                        onChange={messageChangeHandler}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                    />
                    <Button type="submit" disabled={message.length === 0}>
                        Send
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ChatForm;
