import { Box, Button, Link, TextField } from '@material-ui/core';
import Axios from 'axios';
import React, { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

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

const initialFormState = { username: '', email: '', password: '' };

const SignUpForm = () => {
    const [formState, setFormState] = useState<SignUpFormState>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const history = useHistory();
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
                .then(() => {
                    setFormState(initialFormState);
                })
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
            <Box display="flex" flexDirection="column" padding="2rem">
                <h1>Sign Up</h1>
                <Link
                    onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                        event.preventDefault();
                        history.push('/');
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    Sign In
                </Link>
                <TextField
                    value={formState.username}
                    onChange={changeHandler}
                    name="username"
                    margin="normal"
                    variant="outlined"
                    label="Username"
                />
                <TextField
                    value={formState.email}
                    onChange={changeHandler}
                    name="email"
                    margin="normal"
                    variant="outlined"
                    label="Email"
                />
                <TextField
                    value={formState.password}
                    type="password"
                    onChange={changeHandler}
                    name="password"
                    margin="normal"
                    variant="outlined"
                    label="Password"
                />
                <Box display="flex" justifyContent="flex-end">
                    <Button type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default SignUpForm;
