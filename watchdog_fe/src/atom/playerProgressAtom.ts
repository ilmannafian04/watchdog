import { atom } from 'recoil';

const playerProgressAtom = atom({
    key: 'playerProgress',
    default: { played: 0, playedSeconds: 0, loaded: 0, loadedSeconds: 0 },
});

export default playerProgressAtom;
