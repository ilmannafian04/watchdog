import { Button, TextField } from '@material-ui/core';
import Axios from 'axios';
import React, { ChangeEvent, FormEvent, useState } from 'react';

interface SignUpFormState {
    username: string;
    email: string;
    password: string;
}

const validateData = (data: SignUpFormState) => {
    let valid = true;
    if (data.password.length < 8) valid = false;
    return valid;
};

const SignUpForm = () => {
    const [formState, setFormState] = useState<SignUpFormState>({ username: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const changeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const target = event.target;
        switch (target.name) {
            case 'username':
                setFormState({ ...formState, username: target.value });
                break;
            case 'email':
                setFormState({ ...formState, email: target.value });
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
        if (validateData(formState)) {
            Axios.post('/account/signup', new FormData(event.currentTarget))
                .catch((error) => {
                    console.error(error);
                })
                .then(() => {
                    setIsSubmitting(false);
                });
        }
    };
    return (
        <form onSubmit={submitHandler}>
            <TextField value={formState.username} onChange={changeHandler} name="username" />
            <TextField value={formState.email} onChange={changeHandler} name="email" />
            <TextField value={formState.password} type="password" onChange={changeHandler} name="password" />
            <Button type="submit" disabled={isSubmitting}>
                Submit
            </Button>
        </form>
    );
};

export default SignUpForm;
