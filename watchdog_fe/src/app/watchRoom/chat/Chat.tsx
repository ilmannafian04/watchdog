import { Box } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import ChatBox from './ChatBox';
import ChatForm from './ChatForm';
import roomSocketAtom from '../../../atom/roomSocketAtom';
import { baseUrl, wsProtocol } from '../../../util/urlResolver';

const Chat = () => {
    const setRoomSocket = useSetRecoilState(roomSocketAtom);
    const { roomCode } = useParams();
    useEffect(() => {
        let socket: WebSocket;
        if (roomCode) {
            Axios.get('/pingbutprotected')
                .then(() => {
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
                })
                .catch((error) => console.error(error));
        }
        return () => socket?.close();
    }, [setRoomSocket, roomCode]);
    return (
        <Box display="flex" flexDirection="column" height={window.innerHeight} width="300px">
            <Box flexGrow={2} maxHeight="100%" style={{ overflowY: 'scroll' }} children={<ChatBox />} />
            <ChatForm />
        </Box>
    );
};

export default Chat;
