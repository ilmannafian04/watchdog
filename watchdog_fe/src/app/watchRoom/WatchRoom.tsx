import { Box } from '@material-ui/core';
import React from 'react';

import Chat from './chat/Chat';
import SignUpForm from '../SignUpForm';
import LoginForm from '../LoginForm';

const WatchRoom = () => {
    return (
        <Box display="flex">
            <Box flexGrow={2}>
                <SignUpForm />
                <LoginForm />
            </Box>
            <Chat />
        </Box>
    );
};

export default WatchRoom;
