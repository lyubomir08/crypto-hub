export interface Crypto {
    name: string;
    symbol: string;
    currentPrice: number;
    description?: string;
    imageUrl: string;
    owner: string;
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
