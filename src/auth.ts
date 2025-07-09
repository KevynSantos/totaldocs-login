import axios from 'axios'
import {
  getTokenTotalBot,
  handleRemoveStorage,
  handleRetry,
  storageToken,
  getTokenTotalDocs
} from './utilsapi.js'
import { AUTHENTICATE, GET_ME, RECOVER_PASSWORD, REFRESH_TOKEN } from './api/urls.js'
import {  REACT_APP_API_URL,
  REACT_APP_TOTALDOCS_CORE_API_URL} from './config.js'
import ApiService
 from './services/ApiService.js'

export const handleLogin = async (
  company: string,
  username: string,
  password: string,
  userType: string,
) => {
  handleRemoveStorage()
  const url = `${REACT_APP_API_URL + AUTHENTICATE}`

  return handleRetry(async () => {
    const response = await axios.post(url, {
      company,
      username,
      password,
      role: userType,
    })
    return response.data
  })
}

export const refreshToken = async () => {
  const token = getTokenTotalBot()
  const url = `${REACT_APP_API_URL + REFRESH_TOKEN}`

  return handleRetry(async () => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const newToken = response.data.token
    storageToken(newToken)
    return response.data
  })
}

export const authenticate = async (username:string,password:string,business:string) => {
    const api = new ApiService();
    var response = null;
    var status = "success";
    try 
    {
        const data = await api.post(AUTHENTICATE,{username: username, password: password, company: business});
        const res = JSON.stringify(data);
        const json = JSON.parse(res);
        const token = json.token;
        response = token;
    } catch (error) {
        response = error;
        status = "error";
    }

    const res = {
      status:status,
      data:response
    }

    return res;
}

export const newToken = async () => {
  const token = getTokenTotalDocs()
  const url = `${REACT_APP_API_URL + REFRESH_TOKEN}`

  return handleRetry(async () => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const newToken = response.data.token
    storageToken(newToken)
    return response.data
  })
}

export const recoverPassword = async (username: string, email: string, company: string) => {
  handleRemoveStorage()
  const url = `${REACT_APP_API_URL + RECOVER_PASSWORD}`

  return handleRetry(async () => {
    const response = await axios.post(url, {
      username,
      email,
      company,
    })
    return response.data
  })
}

export const getUserPermissions = async () => {
  const token = getTokenTotalBot()
  const url = `${REACT_APP_TOTALDOCS_CORE_API_URL + GET_ME}`

  return handleRetry(async () => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  })
}
