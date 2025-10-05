export interface UserBitsSession {
    bits: Map<string, number>;
    username: string;
    userId: string;
    totalBits: number;
    currentPage: number;
    totalPages: number;
    timestamp: number;
    isComplete: boolean;
    lastMessageId?: string;
    ratio?: number;
}