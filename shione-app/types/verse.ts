export interface Verse {
    verse: string;
    reference: string;
    category: string;
}

export interface CachedVerse extends Verse {
    id: number;
    cached_at: string;
}
