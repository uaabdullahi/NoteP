export interface Note {
    id?: number;
    title: string;
    content: string;
    dateTime: string; // ISO string
    color: number;
    isPinned: boolean;
}
