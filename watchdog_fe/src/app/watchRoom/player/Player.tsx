import { Box } from '@material-ui/core';
import React, { useRef } from 'react';
import ReactPlayer from 'react-player';

import PlayerControl from './PlayerControl';
import PlayerWindow from './PlayerWindow';

const Player = () => {
    const playerRef = useRef<ReactPlayer>(null);
    return (
        <Box display="flex" flexDirection="column" minHeight="100%">
            <Box children={<PlayerWindow playerRef={playerRef} />} />
            <Box children={<PlayerControl />} flexGrow={1} />
        </Box>
    );
};

export default Player;
