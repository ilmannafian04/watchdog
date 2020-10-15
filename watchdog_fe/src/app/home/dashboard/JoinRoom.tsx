import { Box, Button, TextField } from '@material-ui/core';
import Axios from 'axios';
import React, { FormEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import watchRoomsAtom from '../../../atom/watchRoomsAtom';

const JoinRoom = () => {
    const [isJoining, setIsJoining] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [code, setCode] = useState('');
    const setWatchRooms = useSetRecoilState(watchRoomsAtom);
    const handleCancel = () => {
        setIsJoining(false);
        setCode('');
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (code.length > 0) {
            setIsSubmitting(true);
            Axios.post('/watchroom', new FormData(event.currentTarget))
                .then(() => Axios.get('/watchroom'))
                .then((response) => {
                    setWatchRooms(response.data);
                    setCode('');
                    setIsJoining(false);
                })
                .catch((error) => console.error(error))
                .then(() => setIsSubmitting(false));
        }
    };
    return !isJoining ? (
        <Box
            children={<Button onClick={() => setIsJoining(true)}>Join</Button>}
            display="flex"
            justifyContent="flex-end"
        />
    ) : (
        <form onSubmit={handleSubmit}>
            <TextField
                margin="normal"
                variant="outlined"
                label="Join Code"
                value={code}
                name="code"
                fullWidth
                disabled={isSubmitting}
                onChange={(event) => setCode(event.target.value)}
            />
            <Box display="flex" justifyContent="flex-end">
                <Button disabled={isSubmitting} onClick={handleCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={code.length === 0 || isSubmitting}>
                    Join
                </Button>
            </Box>
        </form>
    );
};

export default JoinRoom;
