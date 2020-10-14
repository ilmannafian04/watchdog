import { Button, TextField } from '@material-ui/core';
import Axios from 'axios';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import userAtom from '../atom/userAtom';

interface LoginFormState {
    username: string;
    password: string;
}

const LoginForm = () => {
    const [formState, setFormState] = useState<LoginFormState>({ username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setUser = useSetRecoilState(userAtom);
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
            <TextField name="username" onChange={changeHandler} value={formState.username} />
            <TextField name="password" onChange={changeHandler} value={formState.password} type="password" />
            <Button disabled={isSubmitting} type="submit">
                Sign In
            </Button>
        </form>
    );
};

export default LoginForm;
