import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserForAuth } from '../types/user';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private user$$ = new BehaviorSubject<UserForAuth | null>(null);
    private user$ = this.user$$.asObservable();

    USER_KEY = '[user]';
    user: UserForAuth | null = null;

    get isLogged(): boolean {
        return !!this.user;
    }

    constructor(private http: HttpClient) {
        this.user$.subscribe((user) => {
            this.user = user;
        });
    }

    login(email: string, password: string) {
        return this.http.post<UserForAuth>(`/api/users/login`, { email, password }).pipe(tap(user => {
            this.user$$.next(user);
        }));
    }

    register(username: string, email: string, password: string, rePassword: string) {
        return this.http.post<UserForAuth>(`/api/users/register`, { email, username, password, rePassword })
            .pipe(tap(user => {
                this.user$$.next(user);
            }));
    }

    logout() {
        return this.http.post('/api/users/logout', {}).pipe(tap((user) => {
            this.user$$.next(null);
        }));
    }

    getProfile() {
        return this.http.get<UserForAuth>('/api/users/profile').pipe(tap((user) => {
            this.user$$.next(user);
        }));
    }
}