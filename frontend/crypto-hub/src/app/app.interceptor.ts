
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { catchError, throwError } from 'rxjs';

const { apiUrl } = environment;
const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith(API)) {
        req = req.clone({
            url: req.url.replace(API, apiUrl),
            withCredentials: true,
        });
    }

    return next(req).pipe(
        catchError((err) => {
            const customError = {
                message: err?.error?.message || 'An error occurred.',
                status: err.status || 500,
                url: req.url,
            };

            return throwError(() => customError);
        })
    );
};
