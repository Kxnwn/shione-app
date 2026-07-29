export interface NewMood {
    mood: string;
    category: string;
    note?: string;
    created_at: string;
    updated_at: string;
    isSynced: boolean;
}

export interface Mood extends NewMood {
    id: number;
}