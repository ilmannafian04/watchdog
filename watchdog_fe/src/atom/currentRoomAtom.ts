import { atom } from 'recoil';

import IWatchRoom from '../type/watchRoom';

const currentRoomAtom = atom<IWatchRoom>({
    key: 'currentRoom',
    default: { name: 'Room Name', id: 0, currentVideo: '' },
});

export default currentRoomAtom;
