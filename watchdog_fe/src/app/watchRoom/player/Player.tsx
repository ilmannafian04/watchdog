import { Box } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import PlayerControl from './PlayerControl';
import PlayerWindow from './PlayerWindow';
import roomSocketAtom from '../../../atom/roomSocketAtom';
import playerStateAtom from '../../../atom/playerStateAtom';
import { BaseWebSocketDTO } from '../../../type/dto';
import { baseUrl, isDev, wsProtocol } from '../../../util/urlResolver';

const Player = () => {
    const [roomSocket, setRoomSocket] = useRecoilState(roomSocketAtom);
    const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
    const playerRef = useRef<ReactPlayer>(null);
    const { roomCode } = useParams();
    useEffect(() => {
        let socket: WebSocket;
        if (roomCode) {
            const host = isDev() ? baseUrl(wsProtocol) : `ws://${window.location.host}`;
            socket = new WebSocket(
                `${host}/ws/watch/${roomCode}/?token=${window.localStorage.getItem('watchdogAccessToken')}`
            );
            socket.onopen = () => {
                setRoomSocket((prev) => {
                    return { ...prev, player: socket };
                });
            };
        }
        return () => socket?.close();
    }, [setRoomSocket, roomCode]);
    useEffect(() => {
        const stateChangeHandler = (event: MessageEvent) => {
            const message: BaseWebSocketDTO = JSON.parse(event.data);
            switch (message.type) {
                case 'playerCommand':
                    switch (message.data['command']) {
                        case 'play':
                            setPlayerState({ ...playerState, playing: true });
                            break;
                        case 'pause':
                            setPlayerState({ ...playerState, playing: false });
                            playerRef.current?.seekTo(message.data['timestamp'], 'fraction');
                            break;
                        default:
                    }
                    break;
                case 'changeVideo':
                    setPlayerState({ ...playerState, url: message.data });
                    break;
                case 'seekPlayer':
                    playerRef.current?.seekTo(message.data, 'fraction');
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
