import { Box, Button, Link, TextField } from '@material-ui/core';
import Axios from 'axios';
import React, { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import userAtom from '../../../atom/userAtom';

interface LoginFormState {
    username: string;
    password: string;
}

const LoginForm = () => {
    const [formState, setFormState] = useState<LoginFormState>({ username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setUser = useSetRecoilState(userAtom);
    const history = useHistory();
    const changeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const target = event.target;
        switch (target.name) {
            case 'username':
                setFormState({ ...formState, username: target.value });
                break;
            case 'password':
                setFormState({ ...formState, password: target.value });
                break;
            default:
        }
    };
    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        Axios.post('/token/', new FormData(event.currentTarget))
            .then((response) => {
                window.localStorage.setItem('watchdogAccessToken', response.data['access']);
                window.localStorage.setItem('watchdogRefreshToken', response.data['refresh']);
                setUser((prev) => {
                    return { ...prev, loggedIn: true };
                });
            })
            .catch((error) => {
                console.error(error);
            })
            .then(() => setIsSubmitting(false));
    };
    return (
        <form onSubmit={submitHandler}>
            <Box display="flex" flexDirection="column" padding="2rem">
                <h1>Log In</h1>
                <Link
                    onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                        event.preventDefault();
                        history.push('/signup');
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    Sign Up
                </Link>
                <TextField
                    name="username"
                    onChange={changeHandler}
                    value={formState.username}
                    margin="normal"
                    variant="outlined"
                    label="Username"
                />
                <TextField
                    name="password"
                    onChange={changeHandler}
                    value={formState.password}
                    type="password"
                    margin="normal"
                    variant="outlined"
                    label="Password"
                />
                <Box display="flex" justifyContent="flex-end">
                    <Button disabled={isSubmitting} type="submit">
                        Sign In
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default LoginForm;
