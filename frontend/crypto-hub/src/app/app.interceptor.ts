
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ErrorMsgService } from './core/error-msg/error-msg.service';
import { Router } from '@angular/router';

const { apiUrl } = environment;
const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith(API)) {
        req = req.clone({
            url: req.url.replace(API, apiUrl),
            withCredentials: true,
        });
    }

    const errorMsgService = inject(ErrorMsgService);

    return next(req).pipe(
        catchError((err) => {
            const customError = {
                message: err?.error?.message || 'An error occurred.',
                status: err.status || 500,
                url: req.url,
            };

            errorMsgService.setError(customError);

            return throwError(() => customError);
        })
    );
};
