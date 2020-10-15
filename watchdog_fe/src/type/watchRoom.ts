export default interface IWatchRoom {
    name: string;
    id: number;
    memberCount?: number;
    joinCode?: string;
    currentVideo?: string;
}
