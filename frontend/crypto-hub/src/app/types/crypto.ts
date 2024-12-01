export interface Crypto {
    name: string;
    symbol: string;
    currentPrice: number;
    imageUrl: string;
    _id: string;
}

export interface CryptoDetails {
    name: string;
    symbol: string;
    currentPrice: number;
    description: string;
    imageUrl: string;
    createdAt?: Date;
    comments: any[];
    _id: string;
}
