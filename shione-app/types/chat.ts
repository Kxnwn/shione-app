export interface ChatMessage {
    role: "USER" | "ASSISTANT";
    message: string;
    isThinking?: boolean;
    isNew?: boolean;
}