import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user/user.service';
import { catchError, throwError } from 'rxjs';

const { apiUrl } = environment;
const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(UserService);

    if (req.url.startsWith(API)) {
        req = req.clone({
            url: req.url.replace(API, apiUrl),
            withCredentials: true,
        });
    }

    return next(req).pipe(
        catchError((err) => {
            const errorMessage = err?.error?.message || 'An error occurred.';
            const statusCode = err.status || 500;

            if (statusCode === 401 && errorMessage === 'Token has expired') {
                console.warn('Token expired. Logging out user...');
                
                authService.logout().subscribe(() => {
                    router.navigate(['/login']);
                });
            }

            return throwError(() => ({
                message: errorMessage,
                status: statusCode,
                url: req.url,
            }));
        })
    );
};
