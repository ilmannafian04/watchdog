import { atom } from 'recoil';

interface RoomSocketAtom {
    player: WebSocket | null;
}

const roomSocketAtom = atom<RoomSocketAtom>({ key: 'roomSocketAtom', default: { player: null } });

export default roomSocketAtom;
