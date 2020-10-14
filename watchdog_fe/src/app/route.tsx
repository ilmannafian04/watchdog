import React from 'react';

import Home from './home/Home';
import WatchRoom from './watchRoom/WatchRoom';

const routes: { path: string; component: JSX.Element }[] = [
    {
        path: '/watch/:roomCode',
        component: <WatchRoom />,
    },
    {
        path: '/',
        component: <Home />,
    },
];

export default routes;
