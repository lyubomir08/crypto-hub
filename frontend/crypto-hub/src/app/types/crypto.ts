export interface Crypto {
    name: string;
    symbol: string;
    currentPrice: number;
    description: string;
    imageUrl: string;
    createdAt?: Date;
    _id: string;
}