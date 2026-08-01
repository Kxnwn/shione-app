export interface NewJournal {
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    isSynced: boolean;
}

export interface Journal extends NewJournal {
    id: number;
    createdAt?: string;
}
