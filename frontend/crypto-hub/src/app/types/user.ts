export interface UserForAuth {
    email: string;
    username: string;
    password: string;
    rePassword: string;
    _id?: string;
}

export interface UserProfile {
    email: string;
    username: string;
    profileImage?: string;
    _id?: string;
    createdAt?: string | Date;
}