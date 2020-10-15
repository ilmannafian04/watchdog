import { Box, Button, Slider, TextField } from '@material-ui/core';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import playerStateAtom from '../../../atom/playerStateAtom';
import roomSocketAtom from '../../../atom/roomSocketAtom';

const PlayerControl = () => {
    const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
    const [urlForm, setUrlForm] = useState('');
    const roomSocket = useRecoilValue(roomSocketAtom);
    const setPlaying = (playing: boolean) => {
        setPlayerState((state) => {
            return { ...state, playing: playing };
        });
    };
    const handleSetUrl = (event: FormEvent) => {
        event.preventDefault();
        roomSocket.player?.send(JSON.stringify({ type: 'changeVideo', data: urlForm }));
    };
    return (
        <Box width="100%">
            <Box paddingX="2rem" paddingY="1rem" display="flex" flexDirection="column">
                <Box children={<Slider />} marginBottom="1rem" />
                <Box display="flex">
                    <form onSubmit={handleSetUrl}>
                        <Box display="flex">
                            <TextField
                                variant="outlined"
                                placeholder={playerState.url}
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
                                    data: playerState.playing ? 'pause' : 'play',
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
