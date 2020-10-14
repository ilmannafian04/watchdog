import { atom } from 'recoil';

import IWatchRoom from '../type/watchRoom';

const watchRoomsAtom = atom<IWatchRoom[]>({ key: 'watchRoom', default: [] });

export default watchRoomsAtom;
