import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Axios from 'axios';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import JoinRoom from './JoinRoom';
import NavBar from './NavBar';
import NewRoom from './NewRoom';
import watchRoomsAtom from '../../../atom/watchRoomsAtom';

const Dashboard = () => {
    const [watchRooms, setWatchRooms] = useRecoilState(watchRoomsAtom);
    const history = useHistory();
    useEffect(() => {
        Axios.get('/watchroom')
            .then((response) => {
                setWatchRooms(response.data);
            })
            .catch((error) => console.error(error));
    }, [setWatchRooms]);
    const handleDelete = (id: number) => {
        const data = new FormData();
        data.append('id', id.toString());
        Axios.post('watchroom/delete', data)
            .then(() => {
                setWatchRooms(watchRooms.filter((room) => room.id !== id));
            })
            .catch((error) => console.error(error));
    };
    return (
        <Box minHeight={window.innerHeight}>
            <NavBar />
            <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
                <Paper>
                    <Box padding="2rem" minWidth="30rem">
                        <h1>My Watch Room</h1>
                        <List style={{ overflowY: 'auto' }}>
                            <Box padding="1rem" maxHeight="50vh">
                                {watchRooms.map((room, index) => (
                                    <ListItem key={index} button onClick={() => history.push(`/watch/${room.id}`)}>
                                        <ListItemIcon>
                                            <PlayCircleOutlineIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={room.name}
                                            secondary={room.memberCount ? `${room.memberCount} watcher` : null}
                                        />
                                        {room.owner ? (
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleDelete(room.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        ) : null}
                                    </ListItem>
                                ))}
                            </Box>
                        </List>
                        <JoinRoom />
                        <NewRoom />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Dashboard;
