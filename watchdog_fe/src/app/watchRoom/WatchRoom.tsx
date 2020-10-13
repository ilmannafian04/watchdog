import { Box } from '@material-ui/core';
import React from 'react';

import Chat from './chat/Chat';
import SignUpForm from '../SignUpForm';

const WatchRoom = () => {
    return (
        <Box display="flex">
            <Box flexGrow={2}>
                <SignUpForm />
            </Box>
            <Chat />
        </Box>
    );
};

export default WatchRoom;
