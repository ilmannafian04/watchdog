import { Box, Paper } from '@material-ui/core';
import React from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const Landing = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    return (
        <div>
            <Box position="fixed" top="1rem" left="1rem">
                <Box
                    fontSize="40px"
                    children={
                        <span
                            role="img"
                            aria-label="brand"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                if (pathname !== '/') history.push('/');
                            }}
                        >
                            🐺
                        </span>
                    }
                />
            </Box>
            <Box display="flex" alignItems="stretch" minHeight={window.innerHeight}>
                <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
                    <Paper>
                        <Switch>
                            <Route exact path="/">
                                <LoginForm />
                            </Route>
                            <Route path="/signup">
                                <SignUpForm />
                            </Route>
                        </Switch>
                    </Paper>
                </Box>
                <Box flexGrow={1} display="flex" flexDirection="column">
                    <Box
                        flexGrow={0.75}
                        display="flex"
                        justifyContent="center"
                        alignItems="flex-end"
                        children={<h1>Watch Dog</h1>}
                    />
                    <Box flexGrow={1} />
                    <Box flexGrow={0.75} />
                </Box>
            </Box>
        </div>
    );
};

export default Landing;
