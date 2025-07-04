import * as jose from 'jose';
import { refreshToken } from './auth.js';
import { STORAGE_KEY_COMPANY, STORAGE_KEY_EMAIL, STORAGE_KEY_ID_EMPRESA, STORAGE_KEY_KEEP_LOGGED, STORAGE_KEY_LOCALE, STORAGE_KEY_ROLE, STORAGE_KEY_TIMEZONE, STORAGE_KEY_TOKEN, STORAGE_KEY_USERNAME, STORAGE_KEY_USER_EXP, STORAGE_KEY_USER_ID, } from './constants/api.js';
import { AxiosError } from 'axios';
const MAX_RETRIES = 3;
const RETRY_DELAY = 10000;
export const handleRetry = async (fn, retries = MAX_RETRIES) => {
    try {
        return await fn();
    }
    catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status;
            if (retries > 0 && status && [429, 502, 503, 504].includes(status)) {
                console.log('status', status);
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
                return handleRetry(fn, retries - 1);
            }
        }
        throw error;
    }
};
export const decodeToken = (token) => {
    try {
        const decodedToken = jose.decodeJwt(token);
        return decodedToken;
    }
    catch (error) {
        return null;
    }
};
export const isExpiredToken = () => {
    const userExp = localStorage.getItem(STORAGE_KEY_USER_EXP) || sessionStorage.getItem(STORAGE_KEY_USER_EXP);
    if (!userExp) {
        handleRemoveStorage();
        return true;
    }
    const exp = new Date(Number(userExp) * 1000).getTime() / 1000;
    const now = Math.floor(Date.now() / 1000);
    const isExpired = exp && exp < now;
    if (isExpired) {
        logout();
    }
    if (checkFiveMinutesBeforeExp()) {
        refreshToken();
    }
    return isExpired;
};
const checkFiveMinutesBeforeExp = () => {
    const userExp = localStorage.getItem(STORAGE_KEY_USER_EXP) || sessionStorage.getItem(STORAGE_KEY_USER_EXP);
    const exp = new Date(Number(userExp) * 1000).getTime() / 1000;
    const now = Math.floor(Date.now() / 1000);
    const isFiveMinutesBeforeExp = exp && exp - now < 300;
    return isFiveMinutesBeforeExp;
};
export const isAuth = () => {
    return !!getToken() && !isExpiredToken();
};
export const isAdminAuth = () => {
    const token = getToken();
    const decodedToken = decodeToken(token);
    if (!decodedToken)
        return false;
    return decodedToken?.role === 'user' && isAuth();
};
export const isAttendantAuth = () => {
    const token = getToken();
    const decodedToken = decodeToken(token);
    if (!decodedToken)
        return false;
    return decodedToken?.role === 'attendant' && isAuth();
};
// TODO: pegar do localStorage ou decodificar o token?
export const isFirstLogin = () => {
    const token = getToken();
    const decodedToken = decodeToken(token);
    if (!decodedToken)
        return false;
    return decodedToken?.firstLogin === 'true';
};
export const storageToken = (token) => {
    const decodedToken = decodeToken(token);
    if (!decodedToken)
        return;
    localStorage.setItem(STORAGE_KEY_LOCALE, decodedToken?.locale?.toString());
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER_EXP, decodedToken?.exp?.toString());
    localStorage.setItem(STORAGE_KEY_USERNAME, decodedToken?.sub);
    localStorage.setItem(STORAGE_KEY_ROLE, decodedToken?.role?.toString());
    localStorage.setItem(STORAGE_KEY_ID_EMPRESA, decodedToken?.idEmpresa?.toString());
    localStorage.setItem(STORAGE_KEY_EMAIL, decodedToken?.email?.toString());
    localStorage.setItem(STORAGE_KEY_USER_ID, decodedToken?.userId?.toString());
    localStorage.setItem(STORAGE_KEY_TIMEZONE, decodedToken?.timezone?.toString());
};
export const handleRemoveStorage = () => {
    const keepLogged = localStorage.getItem(STORAGE_KEY_KEEP_LOGGED) === 'true';
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER_EXP);
    localStorage.removeItem(STORAGE_KEY_EMAIL);
    localStorage.removeItem(STORAGE_KEY_ID_EMPRESA);
    localStorage.removeItem(STORAGE_KEY_USER_ID);
    localStorage.removeItem(STORAGE_KEY_TIMEZONE);
    localStorage.removeItem(STORAGE_KEY_LOCALE);
    if (!keepLogged) {
        localStorage.removeItem(STORAGE_KEY_USERNAME);
        localStorage.removeItem(STORAGE_KEY_ROLE);
        localStorage.removeItem(STORAGE_KEY_COMPANY);
    }
};
export const logout = () => {
    handleRemoveStorage();
    window.location.href = '/';
};
export const getToken = () => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN) || sessionStorage.getItem(STORAGE_KEY_TOKEN);
    if (!token) {
        handleRemoveStorage();
        return null;
    }
    return token;
};
