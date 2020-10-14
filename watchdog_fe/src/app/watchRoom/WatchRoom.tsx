import { Box } from '@material-ui/core';
import React from 'react';

import Chat from './chat/Chat';
import Player from './player/Player';

const WatchRoom = () => {
    return (
        <Box display="flex">
            <Box flexGrow={2}>
                <Player />
            </Box>
            <Chat />
        </Box>
    );
};

export default WatchRoom;
