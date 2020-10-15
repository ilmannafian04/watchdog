import { Box, Button, Slider, TextField } from '@material-ui/core';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import currentRoomAtom from '../../../atom/currentRoomAtom';
import playerProgressAtom from '../../../atom/playerProgressAtom';
import playerStateAtom from '../../../atom/playerStateAtom';
import roomSocketAtom from '../../../atom/roomSocketAtom';

const PlayerControl = () => {
    const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
    const [urlForm, setUrlForm] = useState('');
    const playerProgress = useRecoilValue(playerProgressAtom);
    const currentRoom = useRecoilValue(currentRoomAtom);
    const roomSocket = useRecoilValue(roomSocketAtom);
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekValue, setSeekValue] = useState(0);
    const setPlaying = (playing: boolean) => {
        setPlayerState((state) => {
            return { ...state, playing: playing };
        });
    };
    const handleSetUrl = (event: FormEvent) => {
        event.preventDefault();
        roomSocket.player?.send(JSON.stringify({ type: 'changeVideo', data: urlForm }));
        setUrlForm('');
    };
    const seekEndHandler = (event: ChangeEvent<{}>, value: number | number[]) => {
        setIsSeeking(false);
        if (typeof value === 'number') {
            roomSocket.player?.send(
                JSON.stringify({
                    type: 'seekPlayer',
                    data: value / 100,
                })
            );
        }
    };
    return (
        <Box width="100%">
            <Box paddingX="2rem" paddingY="1rem" display="flex" flexDirection="column">
                <Box marginBottom="1rem">
                    <Slider
                        value={isSeeking ? seekValue : playerProgress.played * 100}
                        onMouseDown={() => setIsSeeking(true)}
                        onChange={(event, value) => {
                            if (typeof value === 'number') setSeekValue(value);
                        }}
                        onChangeCommitted={seekEndHandler}
                    />
                </Box>
                <Box display="flex">
                    <form onSubmit={handleSetUrl}>
                        <Box display="flex">
                            <TextField
                                variant="outlined"
                                placeholder={playerState.url ? playerState.url : currentRoom.currentVideo}
                                label="Video URL"
                                value={urlForm}
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setUrlForm(event.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Button type="submit">Set</Button>
                        </Box>
                    </form>
                    <Button
                        onClick={() => {
                            setPlaying(!playerState.playing);
                            roomSocket.player?.send(
                                JSON.stringify({
                                    type: 'playerCommand',
                                    data: {
                                        command: playerState.playing ? 'pause' : 'play',
                                        timestamp: playerProgress.played,
                                    },
                                })
                            );
                        }}
                    >
                        {playerState.playing ? 'Pause' : 'Play'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PlayerControl;
