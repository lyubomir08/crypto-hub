import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserForAuth } from '../types/user';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private user$$ = new BehaviorSubject<UserForAuth | undefined>(undefined);
    private user$ = this.user$$.asObservable();

    USER_KEY = '[user]';
    user: object | null = null;

    get isLogged(): boolean {
        return !!this.user;
    }

    constructor(private http: HttpClient) {
        try {
            const lsUser = localStorage.getItem(this.USER_KEY) || '';
            this.user = JSON.parse(lsUser);
        } catch (error) {
            this.user = null;
        }
    }

    login(email: string, password: string) {
        return this.http.post<UserForAuth>(`/api/login`, { email, password }).pipe(tap(user => {
            this.user$$.next(user);
        }));
    }

    logout() {
        this.user = null;
        localStorage.removeItem(this.USER_KEY);
    }
}