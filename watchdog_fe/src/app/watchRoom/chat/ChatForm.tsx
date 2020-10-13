import { Box, Button, TextField } from '@material-ui/core';
import React, { ChangeEvent, FormEvent, FunctionComponent, useState } from 'react';

interface ChatFormProps {
    sendFn: (message: string) => void;
}

const ChatForm: FunctionComponent<ChatFormProps> = ({ sendFn }) => {
    const [message, setMessage] = useState<string>('');
    const messageChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (!/\n/.test(event.target.value)) {
            setMessage(event.target.value);
        }
    };
    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        if (message.length > 0) sendFn(message);
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
