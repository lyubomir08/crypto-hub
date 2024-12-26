import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { UserForAuth } from '../types/user';
import { BehaviorSubject, catchError, of, Subscription, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService implements OnDestroy {
    private user$$ = new BehaviorSubject<UserForAuth | null>(null);
    private user$ = this.user$$.asObservable();

    user: UserForAuth | null = null;
    userSubscription: Subscription | null = null;

    get isLogged(): boolean {
        return !!this.user;
    }

    constructor(private http: HttpClient) {
        this.userSubscription = this.user$.subscribe((user) => {
            this.user = user;
        });
    }

    login(email: string, password: string) {
        return this.http.post<UserForAuth>(`/api/users/login`, { email, password })
            .pipe(
                tap(user => {
                    this.user$$.next(user);

                    localStorage.setItem('user', user?.email);

                    if (user?.email === 'admin123@gmail.com') {
                        localStorage.setItem('role', 'admin');
                    } else {
                        localStorage.setItem('role', 'user');
                    }
                }),
                catchError((err) => {
                    return throwError(() => err);
                })
            );
    }

    register(username: string, email: string, password: string, rePassword: string) {
        return this.http.post<UserForAuth>(`/api/users/register`, { email, username, password, rePassword });
    }

    logout() {
        return this.http.post('/api/users/logout', {}).pipe(
            tap(() => {
                this.user$$.next(null);
                localStorage.removeItem('user');
                localStorage.removeItem('role');
            })
        );
    }

    getProfile() {
        return this.http.get<UserForAuth | null>('/api/users/profile').pipe(
            tap((user) => {
                this.user$$.next(user || null);
            }),
            catchError((error) => {
                if (error.status === 401) {
                    this.user$$.next(null);
                    return of(null);
                }
                console.error('Error fetching profile:', error.message);
                return throwError(() => error);
            })
        );
    }

    updateProfile(username: string, email: string) {
        return this.http.put<UserForAuth>('/api/users/update', { username, email }).pipe(
            tap((updatedUser) => {
                this.user$$.next(updatedUser);
                localStorage.setItem('user', updatedUser.email);
            }),
            catchError((err) => throwError(() => err))
        );
    }    

    getRole(): string | null {
        return localStorage.getItem('role');
    }

    isAdmin(): boolean {
        return this.getRole() === 'admin';
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }
}