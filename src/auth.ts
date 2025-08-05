import axios from 'axios'
import {
  getTokenTotalBot,
  handleRemoveStorage,
  handleRetry,
  storageToken,
  getTokenTotalDocs
} from './utilsapi.js'
import { AUTHENTICATE, RECOVER_PASSWORD, REFRESH_TOKEN } from './api/urls.js'
import {TOTAL_DOCS_LOGIN_OLD,REACT_APP_TOTALDOCS_CORE_API_URL,TOTAL_DOCS_LOGOUT_OLD} from './config.js'
import ApiService
 from './services/ApiService.js'

export const handleLogin = async (
  company: string,
  username: string,
  password: string,
  userType: string,
) => {
  handleRemoveStorage()
  const url = location.origin+REACT_APP_TOTALDOCS_CORE_API_URL+`${AUTHENTICATE}`

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
  const url = location.origin+REACT_APP_TOTALDOCS_CORE_API_URL+`${REFRESH_TOKEN}`

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

export const logoutTotalDocsOld = async() =>
{
  try {
    const api = new ApiService(location.origin);

    await api.get(TOTAL_DOCS_LOGOUT_OLD);

  } catch (err) {
    console.error('Erro ao fazer logout ou buscar sessão:', err);
  }
}

export const loginTotalDocsOld = async (username:string,password:string,business:string) => {
  try {
    const api = new ApiService(location.origin);

    await api.get(`${TOTAL_DOCS_LOGIN_OLD}?nomeEmpresa=${business}&usuario=${username}&senha=${password}`);

  } catch (err) {
    console.error('Erro ao fazer login ou buscar sessão:', err);
  }
}

export const authenticate = async (username:string,password:string,business:string) => {
    const api = new ApiService(location.origin);
    var response = null;
    var status = "success";
    try 
    {
        const data = await api.post(REACT_APP_TOTALDOCS_CORE_API_URL+AUTHENTICATE,{username: username, password: password, company: business});
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
  const url = location.origin+REACT_APP_TOTALDOCS_CORE_API_URL+`${REFRESH_TOKEN}`

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
  const url = location.origin+REACT_APP_TOTALDOCS_CORE_API_URL+`${RECOVER_PASSWORD}`

  return handleRetry(async () => {
    const response = await axios.post(url, {
      username,
      email,
      company,
    })
    return response.data
  })
}

