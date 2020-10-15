import { Button, Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Axios from 'axios';
import React, { FunctionComponent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import currentRoomAtom from '../../../atom/currentRoomAtom';
import IWatchRoom from '../../../type/watchRoom';

const ChatHeader: FunctionComponent<{ room: IWatchRoom }> = ({ room }) => {
    const [currentRoom, setCurrentRoom] = useRecoilState(currentRoomAtom);
    const history = useHistory();
    const { roomCode } = useParams();
    return (
        <Grid container>
            <Grid
                item
                children={
                    <Button onClick={() => history.push('/')}>
                        <ArrowBackIcon />
                    </Button>
                }
                xs={4}
                alignItems="center"
                container
            />
            <Grid item xs={4} justify="center" alignItems="center" container>
                <span>{room.name}</span>
            </Grid>
            {room.joinCode ? (
                <Grid item xs={4} justify="center" alignItems="center" container>
                    <span>{room.joinCode}</span>
                </Grid>
            ) : (
                <Grid item xs={4} justify="flex-end" container>
                    <Button
                        onClick={() => {
                            const data = new FormData();
                            data.append('id', roomCode);
                            Axios.post('/watchroom/generatejoin', data)
                                .then((response) => {
                                    setCurrentRoom({ ...currentRoom, joinCode: response.data['code'] });
                                })
                                .catch((error) => console.error(error));
                        }}
                    >
                        <PersonAddIcon />
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

export default ChatHeader;
