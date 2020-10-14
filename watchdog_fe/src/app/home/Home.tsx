import React from 'react';
import { useRecoilValue } from 'recoil';

import Dashboard from './dashboard/Dashboard';
import Landing from './landing/Landing';
import userAtom from '../../atom/userAtom';

const Home = () => {
    const user = useRecoilValue(userAtom);
    return user.loggedIn ? <Dashboard /> : <Landing />;
};

export default Home;
