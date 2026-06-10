import { environment } from '../environment/environment.development';

export const API = {
  AUTH: {
    LOGIN: `${environment.apiBaseUrl}/api/auth/login/`,
    REFRESH: `${environment.apiBaseUrl}/api/auth/token/refresh/`,
    LOGOUT: `${environment.apiBaseUrl}/api/auth/logout/`,
  },
};
