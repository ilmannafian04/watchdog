import { atom } from 'recoil';

export interface PlayerState {
    playing: boolean;
}

const playerStateAtom = atom<PlayerState>({ key: 'playerState', default: { playing: false } });

export default playerStateAtom;
