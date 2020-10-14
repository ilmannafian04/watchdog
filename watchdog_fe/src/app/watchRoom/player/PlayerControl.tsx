import { Box, Button } from '@material-ui/core';
import React from 'react';
import { useRecoilState } from 'recoil';

import playerStateAtom from '../../../atom/PlayerStateAtom';

const PlayerControl = () => {
    const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
    const setPlaying = (playing: boolean) => {
        setPlayerState((state) => {
            return { ...state, playing: playing };
        });
    };
    return (
        <Box display="flex">
            <Button onClick={() => setPlaying(!playerState.playing)}>{playerState.playing ? 'Pause' : 'Play'}</Button>
        </Box>
    );
};

export default PlayerControl;
