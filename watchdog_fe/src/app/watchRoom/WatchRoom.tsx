import { Box } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import Chat from './chat/Chat';
import Player from './player/Player';
import currentRoomAtom from '../../atom/currentRoomAtom';

const WatchRoom = () => {
    const setCurrentRoom = useSetRecoilState(currentRoomAtom);
    const { roomCode } = useParams();
    useEffect(() => {
        Axios.get(`/watchroom?id=${roomCode}`)
            .then((response) => {
                setCurrentRoom(response.data['room']);
            })
            .catch((error) => console.error(error));
    });
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
