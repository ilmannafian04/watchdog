import { Box, Button } from '@material-ui/core';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import playerStateAtom from '../../../atom/playerStateAtom';
import roomSocketAtom from '../../../atom/roomSocketAtom';

const PlayerControl = () => {
    const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
    const roomSocket = useRecoilValue(roomSocketAtom);
    const setPlaying = (playing: boolean) => {
        setPlayerState((state) => {
            return { ...state, playing: playing };
        });
    };
    return (
        <Box display="flex">
            <Button
                onClick={() => {
                    setPlaying(!playerState.playing);
                    roomSocket.player?.send(
                        JSON.stringify({
                            type: 'playerCommand',
                            data: playerState.playing ? 'pause' : 'play',
                        })
                    );
                }}
            >
                {playerState.playing ? 'Pause' : 'Play'}
            </Button>
        </Box>
    );
};

export default PlayerControl;
