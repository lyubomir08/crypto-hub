export interface Crypto {
    _id: string;
    name: string;
    symbol: string;
    currentPrice: number;
    description?: string;
    imageUrl: string;
    owner: string;
    createdAt: string;
    updatedAt?: string;
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
    owner: OwnerDetails;
}

export interface OwnerDetails {
    _id: string;
    username: string;
    email: string;
}

export interface EditDetails {
    _id: string,
    name: string,
    symbol: string,
    currentPrice: number,
    description: string,
    imageUrl: string;
}

export interface CryptoNewsItem {
    title: string;
    url: string;
    source: { title: string };
    created_at: string;
}

export interface CryptoNewsResponse {
    results: CryptoNewsItem[];
}

export interface LivePrices {
    [key: string]: {
        usd: number;
    };
}

