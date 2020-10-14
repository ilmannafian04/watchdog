import { Box, List, ListItem, ListItemIcon, ListItemText, Paper } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Axios from 'axios';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import NavBar from './NavBar';
import watchRoomsAtom from '../../../atom/watchRoomsAtom';
import { useHistory } from 'react-router-dom';

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
    return (
        <Box minHeight={window.innerHeight}>
            <NavBar />
            <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
                <Paper>
                    <Box padding="2rem">
                        <h1>My Watch Room</h1>
                        <List>
                            {watchRooms.map((room, index) => (
                                <ListItem key={index} button onClick={() => history.push(`/watch/${room.id}`)}>
                                    <ListItemIcon>
                                        <PlayCircleOutlineIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={room.name} secondary={`${room.memberCount} watcher`} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Dashboard;
