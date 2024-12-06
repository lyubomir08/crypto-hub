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
                }),
                catchError((err) => {
                    console.error('Login error:', err);
                    return throwError(() => err);
                })
            );
    }

    register(username: string, email: string, password: string, rePassword: string) {
        return this.http.post<UserForAuth>(`/api/users/register`, { email, username, password, rePassword })
            .pipe(tap(user => {
                this.user$$.next(user);
                localStorage.setItem('user', user?.email);
            }));
    }

    logout() {
        return this.http.post('/api/users/logout', {}).pipe(tap((user) => {
            this.user$$.next(null);
            localStorage.removeItem('user');
        }));
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

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }
}