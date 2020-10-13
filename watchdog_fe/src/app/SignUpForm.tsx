import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import Axios, { AxiosResponse } from 'axios';

interface SignUpFormState {
    username: string;
    password: string;
}

const validateData = (data: SignUpFormState) => {
    let valid = true;
    if (data.password.length <= 8) valid = false;
    return valid;
};

const SignUpForm = () => {
    const [formState, setFormState] = useState<SignUpFormState>({ username: '', password: '' });
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
    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        if (validateData(formState)) {
            Axios.get('/setcsrf')
                .then((response: AxiosResponse) => {
                    console.log('setting csrf');
                    console.log(response);
                    console.log(document.cookie);
                    return Axios.post('/account/signup', { withCredentials: true });
                })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };
    return (
        <form onSubmit={submitHandler}>
            <TextField value={formState.username} onChange={changeHandler} name="username" />
            <TextField value={formState.password} type="password" onChange={changeHandler} name="password" />
            <Button type="submit">Submit</Button>
        </form>
    );
};

export default SignUpForm;
