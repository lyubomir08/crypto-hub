export interface Article {
    _id: string;
    title: string;
    content: string;
    author: { _id: string, username: string };
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}