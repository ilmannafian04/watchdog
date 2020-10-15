import { Box, Button, TextField } from '@material-ui/core';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';

import roomSocketAtom from '../../../atom/roomSocketAtom';

const ChatForm = () => {
    const [message, setMessage] = useState<string>('');
    const socket = useRecoilValue(roomSocketAtom);
    const messageChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (!/\n/.test(event.target.value)) {
            setMessage(event.target.value);
        }
    };
    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        if (message.length > 0) socket.chat?.send(JSON.stringify({ type: 'chat.newMessage', data: message }));
    };
    return (
        <form onSubmit={submitHandler}>
            <Box display="flex">
                <TextField multiline fullWidth value={message} onChange={messageChangeHandler} />
                <Button type="submit" disabled={message.length === 0}>
                    Send
                </Button>
            </Box>
        </form>
    );
};

export default ChatForm;
