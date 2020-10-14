import { Box, Button, TextField } from '@material-ui/core';
import Axios from 'axios';
import React, { FormEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import watchRoomsAtom from '../../../atom/watchRoomsAtom';

const NewRoom = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState('');
    const setWatchRooms = useSetRecoilState(watchRoomsAtom);
    const handleCancel = () => {
        setIsCreating(false);
        setName('');
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (name.length > 0) {
            setIsSubmitting(true);
            Axios.post('/watchroom', new FormData(event.currentTarget))
                .then((response) => {
                    setWatchRooms((prev) => {
                        return [...prev, response.data['room']];
                    });
                })
                .catch((error) => console.error(error))
                .then(() => setIsSubmitting(false));
        }
    };
    return !isCreating ? (
        <Box
            children={<Button onClick={() => setIsCreating(true)}>New</Button>}
            display="flex"
            justifyContent="flex-end"
        />
    ) : (
        <form onSubmit={handleSubmit}>
            <TextField
                margin="normal"
                variant="outlined"
                label="Name"
                value={name}
                name="name"
                fullWidth
                disabled={isSubmitting}
                onChange={(event) => setName(event.target.value)}
            />
            <Box display="flex" justifyContent="flex-end">
                <Button disabled={isSubmitting} onClick={handleCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={name.length === 0 || isSubmitting}>
                    Create
                </Button>
            </Box>
        </form>
    );
};

export default NewRoom;
