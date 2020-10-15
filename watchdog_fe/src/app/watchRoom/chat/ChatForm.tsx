import { Box, Button, TextField } from '@material-ui/core';
import React, { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import roomSocketAtom from '../../../atom/roomSocketAtom';

const ChatForm = () => {
    const [message, setMessage] = useState<string>('');
    const socket = useRecoilValue(roomSocketAtom);
    const formRef = useRef<HTMLFormElement>(null);
    const messageChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (!/\n/.test(event.target.value)) {
            setMessage(event.target.value);
        }
    };
    const sendChat = () => {
        if (message.length > 0) {
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
    );
};

export default ChatForm;
