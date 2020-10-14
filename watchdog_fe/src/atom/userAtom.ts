import { atom } from 'recoil';

interface IUserAtom {
    loggedIn: boolean;
}

const userAtom = atom<IUserAtom>({ key: 'userAtom', default: { loggedIn: false } });

export default userAtom;
