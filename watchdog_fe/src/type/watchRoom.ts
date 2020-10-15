export default interface IWatchRoom {
    name: string;
    id: number;
    owner?: boolean;
    memberCount?: number;
    joinCode?: string;
    currentVideo?: string;
}
