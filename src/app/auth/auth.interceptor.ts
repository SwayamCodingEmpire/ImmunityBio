import {
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { API } from '../utils/api.constants';

const AUTH_URLS = [API.AUTH.LOGIN, API.AUTH.REFRESH, API.AUTH.LOGOUT];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const withBearer = (r: HttpRequest<unknown>, token: string) =>
    r.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  const isAuthUrl = AUTH_URLS.some((url) => req.url === url);

  const token = auth.getAccessToken();
  const outgoing = token && !isAuthUrl ? withBearer(req, token) : req;

  return next(outgoing).pipe(
    catchError((err: HttpErrorResponse) => {
      if (!isAuthUrl && err.status === 401 && auth.getRefreshToken()) {
        return auth.refreshToken().pipe(
          switchMap((res) => next(withBearer(req, res.access))),
          catchError((refreshErr) => {
            auth.logout();
            return throwError(() => refreshErr);
          }),
        );
      }
      return throwError(() => err);
    }),
  );
};
