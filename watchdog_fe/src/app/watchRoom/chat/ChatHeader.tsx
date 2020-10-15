import { Button, Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';

import IWatchRoom from '../../../type/watchRoom';

const ChatHeader: FunctionComponent<{ room: IWatchRoom }> = ({ room }) => {
    const history = useHistory();
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
            <Grid item children={<span>{room.name}</span>} xs={4} justify="center" alignItems="center" container />
        </Grid>
    );
};

export default ChatHeader;
