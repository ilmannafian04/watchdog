import React from 'react';
import { Button } from '@material-ui/core';
import { useSetRecoilState } from 'recoil';

import userAtom from '../../atom/userAtom';

const Dashboard = () => {
    const setUserAtom = useSetRecoilState(userAtom);
    return (
        <div>
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
                Logout
            </Button>
        </div>
    );
};

export default Dashboard;
