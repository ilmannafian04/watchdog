import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import routes from './route';
import userAtom from '../atom/userAtom';

const App = () => {
    const setUser = useSetRecoilState(userAtom);
    useEffect(() => {
        if (window.localStorage.getItem('watchdogRefreshToken')) {
            setUser((prev) => {
                return { ...prev, loggedIn: true };
            });
        }
    }, [setUser]);
    return (
        <Switch>
            {routes.map((route, index) => (
                <Route path={route.path} key={index}>
                    {route.component}
                </Route>
            ))}
        </Switch>
    );
};

export default App;
