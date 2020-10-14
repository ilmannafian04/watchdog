import React from 'react';
import { useRecoilValue } from 'recoil';

import Dashboard from './Dashboard';
import Landing from './Landing';
import userAtom from '../../atom/userAtom';

const Home = () => {
    const user = useRecoilValue(userAtom);
    return user.loggedIn ? <Dashboard /> : <Landing />;
};

export default Home;
