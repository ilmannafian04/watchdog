import { atom } from 'recoil';

interface RoomSocketAtom {
    player: WebSocket | null;
    chat: WebSocket | null;
}

const roomSocketAtom = atom<RoomSocketAtom>({ key: 'roomSocketAtom', default: { player: null, chat: null } });

export default roomSocketAtom;
