export interface UserBitsSession {
    bits: Map<string, number>;
    username: string;
    userId: string;
    totalBits: number;
    currentPage: number;
    totalPages: number;
    timestamp: number;
    isComplete: boolean;
    ratio?: number;
    lastMessageId?: string;
    sessionId?: string;
    lastSessionId?: string;
}