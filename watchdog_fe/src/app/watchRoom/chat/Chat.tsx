import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import ChatBox from './ChatBox';
import ChatForm from './ChatForm';
import ChatHeader from './ChatHeader';
import currentRoomAtom from '../../../atom/currentRoomAtom';
import roomSocketAtom from '../../../atom/roomSocketAtom';
import { baseUrl, wsProtocol } from '../../../util/urlResolver';

const Chat = () => {
    const currentRoom = useRecoilValue(currentRoomAtom);
    const setRoomSocket = useSetRecoilState(roomSocketAtom);
    const { roomCode } = useParams();
    useEffect(() => {
        let socket: WebSocket;
        if (roomCode) {
            socket = new WebSocket(
                `${baseUrl(wsProtocol)}/ws/chat/${roomCode}/?token=${window.localStorage.getItem(
                    'watchdogAccessToken'
                )}`
            );
            socket.onopen = () => {
                setRoomSocket((prev) => {
                    return { ...prev, chat: socket };
                });
            };
        }
        return () => socket?.close();
    }, [setRoomSocket, roomCode]);
    return (
        <Box display="flex" flexDirection="column" height={window.innerHeight} width="300px">
            <ChatHeader room={currentRoom} />
            <Box flexGrow={1} maxHeight="100%" style={{ overflowY: 'scroll' }} children={<ChatBox />} />
            <ChatForm />
        </Box>
    );
};

export default Chat;
