import axios from 'axios';
import { getToken, handleRemoveStorage, handleRetry, storageToken, } from './utilsapi.js';
import { AUTHENTICATE, GET_ME, RECOVER_PASSWORD, REFRESH_TOKEN } from './api/urls.js';
import { REACT_APP_API_URL, REACT_APP_TOTALDOCS_CORE_API_URL } from './config.js';
export const handleLogin = async (company, username, password, userType) => {
    handleRemoveStorage();
    const url = `${REACT_APP_API_URL + AUTHENTICATE}`;
    return handleRetry(async () => {
        const response = await axios.post(url, {
            company,
            username,
            password,
            role: userType,
        });
        return response.data;
    });
};
export const refreshToken = async () => {
    const token = getToken();
    const url = `${REACT_APP_API_URL + REFRESH_TOKEN}`;
    return handleRetry(async () => {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const newToken = response.data.token;
        storageToken(newToken);
        return response.data;
    });
};
export const recoverPassword = async (username, email, company) => {
    handleRemoveStorage();
    const url = `${REACT_APP_API_URL + RECOVER_PASSWORD}`;
    return handleRetry(async () => {
        const response = await axios.post(url, {
            username,
            email,
            company,
        });
        return response.data;
    });
};
export const getUserPermissions = async () => {
    const token = getToken();
    const url = `${REACT_APP_TOTALDOCS_CORE_API_URL + GET_ME}`;
    return handleRetry(async () => {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    });
};
