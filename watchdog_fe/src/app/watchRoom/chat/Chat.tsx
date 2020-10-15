import { Box } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import ChatBox from './ChatBox';
import ChatForm from './ChatForm';
import roomSocketAtom from '../../../atom/roomSocketAtom';
import { baseUrl, wsProtocol } from '../../../util/urlResolver';

const Chat = () => {
    const setRoomSocket = useSetRecoilState(roomSocketAtom);
    useEffect(() => {
        let socket: WebSocket;
        Axios.get('/pingbutprotected')
            .then(() => {
                socket = new WebSocket(
                    `${baseUrl(wsProtocol)}/ws/chat/lol/?token=${window.localStorage.getItem('watchdogAccessToken')}`
                );
                socket.onopen = () => {
                    setRoomSocket((prev) => {
                        return { ...prev, chat: socket };
                    });
                };
            })
            .catch((error) => console.error(error));
        return () => socket?.close();
    }, [setRoomSocket]);
    return (
        <Box display="flex" flexDirection="column" height={window.innerHeight} width="300px">
            <Box flexGrow={2} maxHeight="100%" style={{ overflowY: 'scroll' }} children={<ChatBox />} />
            <ChatForm />
        </Box>
    );
};

export default Chat;
