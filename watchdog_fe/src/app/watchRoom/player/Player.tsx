import { Box } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useRecoilState } from 'recoil';

import PlayerControl from './PlayerControl';
import PlayerWindow from './PlayerWindow';
import roomSocketAtom from '../../../atom/roomSocketAtom';
import playerStateAtom from '../../../atom/playerStateAtom';
import { BaseWebSocketDTO } from '../../../type/dto';
import { baseUrl, wsProtocol } from '../../../util/urlResolver';

const Player = () => {
    const [roomSocket, setRoomSocket] = useRecoilState(roomSocketAtom);
    const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
    const playerRef = useRef<ReactPlayer>(null);
    useEffect(() => {
        let socket: WebSocket;
        Axios.get('/pingbutprotected')
            .then(() => {
                socket = new WebSocket(
                    `${baseUrl(wsProtocol)}/ws/watch/lol/?token=${window.localStorage.getItem('watchdogAccessToken')}`
                );
                socket.onopen = () => {
                    setRoomSocket((prev) => {
                        return { ...prev, player: socket };
                    });
                };
            })
            .catch((error) => console.error(error));
        return () => socket?.close();
    }, [setRoomSocket]);
    useEffect(() => {
        const stateChangeHandler = (event: MessageEvent) => {
            const message: BaseWebSocketDTO = JSON.parse(event.data);
            switch (message.type) {
                case 'playerCommand':
                    switch (message.data) {
                        case 'play':
                            setPlayerState({ ...playerState, playing: true });
                            break;
                        case 'pause':
                            setPlayerState({ ...playerState, playing: false });
                            break;
                        default:
                    }
                    break;
                default:
            }
        };
        roomSocket.player?.addEventListener('message', stateChangeHandler);
        return () => {
            roomSocket.player?.removeEventListener('message', stateChangeHandler);
        };
    }, [roomSocket, playerState, setPlayerState]);
    return (
        <Box display="flex" flexDirection="column" minHeight="100%">
            <PlayerWindow playerRef={playerRef} />
            <Box children={<PlayerControl />} flexGrow={1} />
        </Box>
    );
};

export default Player;
