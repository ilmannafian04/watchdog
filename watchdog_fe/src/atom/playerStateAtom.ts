import { atom } from 'recoil';

export interface PlayerState {
    playing: boolean;
    url: string;
}

const playerStateAtom = atom<PlayerState>({
    key: 'playerState',
    default: { playing: false, url: 'https://youtu.be/I4ocxF3sSI0' },
});

export default playerStateAtom;
