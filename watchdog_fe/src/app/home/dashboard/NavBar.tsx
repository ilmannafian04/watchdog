import { AppBar, Box, Button, Toolbar } from '@material-ui/core';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import userAtom from '../../../atom/userAtom';

const NavBar = () => {
    const setUserAtom = useSetRecoilState(userAtom);
    return (
        <AppBar position="fixed" style={{ background: 'transparent', boxShadow: 'none', color: 'black' }}>
            <Toolbar>
                <Box flexGrow={1} />
                <Box
                    children={
                        <Button
                            onClick={() => {
                                ['watchdogAccessToken', 'watchdogRefreshToken'].forEach((key) =>
                                    window.localStorage.removeItem(key)
                                );
                                setUserAtom((prev) => {
                                    return { ...prev, loggedIn: false };
                                });
                            }}
                        >
                            Sign Out
                        </Button>
                    }
                />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
