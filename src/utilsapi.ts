import * as jose from 'jose'
import { newToken, refreshToken, authenticate, loginTotalDocsOld } from './auth.js'
import {
  STORAGE_KEY_COMPANY,
  STORAGE_KEY_EMAIL,
  STORAGE_KEY_ID_EMPRESA,
  STORAGE_KEY_KEEP_LOGGED,
  STORAGE_KEY_LOCALE,
  STORAGE_KEY_ROLE,
  STORAGE_KEY_TIMEZONE,
  STORAGE_KEY_TOKEN,
  STORAGE_KEY_USERNAME,
  STORAGE_KEY_USER_EXP,
  STORAGE_KEY_USER_ID,
} from './constants/api.js'
import { AxiosError } from 'axios'
import { getCompanyName } from './services/totalbot/totalbotservice.js'
import { PERMISSIONS_USER, SESSION_TOTAL_DOCS } from './constants/StorageConstants.js'
import { setUserPermissions, checkLoginInPlatforms, doLogoutTotalDocsOld } from './services/LoginService'

const MAX_RETRIES = 3
const RETRY_DELAY = 10000

export const handleRetry = async (fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> => {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status
      if (retries > 0 && status && [429, 502, 503, 504].includes(status)) {
        console.log('status', status)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
        return handleRetry(fn, retries - 1)
      }
    }
    throw error
  }
}

export const decodeToken = (token: string) => {
  try {
    return jose.decodeJwt(token)
  } catch {
    return null
  }
}

export const isExpiredToken = async () => {
  const userExp =
    localStorage.getItem(STORAGE_KEY_USER_EXP) || sessionStorage.getItem(STORAGE_KEY_USER_EXP)

  if (!userExp) {
    handleRemoveStorage()
    return true
  }

  const exp = Number(userExp)
  const now = Math.floor(Date.now() / 1000)
  const remainingTime = exp - now

  // Se faltam menos de 5 minutos, tenta renovar
  if (remainingTime > 0 && remainingTime < 300) {
    try {
      await refreshToken()
      return false
    } catch (err) {
      // falha na renovação → deixa cair para o logout abaixo
    }
  }

  if (remainingTime <= 0) {
    logout()
    return true
  }

  return false
}

const checkFiveMinutesBeforeExp = () => {
  const userExp =
    localStorage.getItem(STORAGE_KEY_USER_EXP) || sessionStorage.getItem(STORAGE_KEY_USER_EXP)

  if (!userExp) return false

  const exp = Number(userExp)
  const now = Math.floor(Date.now() / 1000)

  return exp - now < 300
}

export const isAuth = async () => {
  return !!getTokenTotalBot() && !(await isExpiredToken())
}

export const isAdminAuth = () => {
  const token = getTokenTotalBot()
  const decodedToken = decodeToken(token as string)

  if (!decodedToken) return false
  return decodedToken?.role === 'user' && isAuth()
}

export const isAttendantAuth = () => {
  const token = getTokenTotalBot()
  const decodedToken = decodeToken(token as string)

  if (!decodedToken) return false
  return decodedToken?.role === 'attendant' && isAuth()
}

export const doLoginTotalDocsOld = async (username:string,password:string,business:string) => {
  await loginTotalDocsOld(username,password,business);
}

export const isFirstLogin = () => {
  const token = getTokenTotalBot()
  const decodedToken = decodeToken(token as string)

  if (!decodedToken) return false
  return decodedToken?.firstLogin === 'true'
}

export const storageToken = async (token: string) => {
  const decodedToken = decodeToken(token)
  if (!decodedToken) return

  const companyName = await getCompanyName()

  localStorage.setItem(STORAGE_KEY_COMPANY, companyName)
  localStorage.setItem(STORAGE_KEY_LOCALE, decodedToken?.locale?.toString() || '')
  localStorage.setItem(STORAGE_KEY_TOKEN, token)
  localStorage.setItem(STORAGE_KEY_USER_EXP, decodedToken?.exp?.toString() || '')
  localStorage.setItem(STORAGE_KEY_USERNAME, decodedToken?.sub || '')
  localStorage.setItem(STORAGE_KEY_ROLE, decodedToken?.role?.toString() || '')
  localStorage.setItem(STORAGE_KEY_ID_EMPRESA, decodedToken?.idEmpresa?.toString() || '')
  localStorage.setItem(STORAGE_KEY_EMAIL, decodedToken?.email?.toString() || '')
  localStorage.setItem(STORAGE_KEY_USER_ID, decodedToken?.userId?.toString() || '')
  localStorage.setItem(STORAGE_KEY_TIMEZONE, decodedToken?.timezone?.toString() || '')
}

export const login = async (username: string, password: string, business: string) => {
  const res = await authenticate(username, password, business)
  const token = res.data
  localStorage.setItem(SESSION_TOTAL_DOCS, token)
  await newToken()
  await setUserPermissions()
  await checkLoginInPlatforms(username, password, business)
}

export const refreshUserPermissions = async () => {
  await setUserPermissions()
}

export const handleRemoveStorage = () => {
  const keepLogged = localStorage.getItem(STORAGE_KEY_KEEP_LOGGED) === 'true'

  localStorage.removeItem(STORAGE_KEY_TOKEN)
  localStorage.removeItem(SESSION_TOTAL_DOCS)
  localStorage.removeItem(STORAGE_KEY_USER_EXP)
  localStorage.removeItem(STORAGE_KEY_EMAIL)
  localStorage.removeItem(STORAGE_KEY_ID_EMPRESA)
  localStorage.removeItem(STORAGE_KEY_USER_ID)
  localStorage.removeItem(STORAGE_KEY_TIMEZONE)
  localStorage.removeItem(STORAGE_KEY_LOCALE)

  if (!keepLogged) {
    localStorage.removeItem(STORAGE_KEY_USERNAME)
    localStorage.removeItem(STORAGE_KEY_ROLE)
    localStorage.removeItem(STORAGE_KEY_COMPANY)
  }
}

export const logout = async () => {
  handleRemoveStorage();
  await doLogoutTotalDocsOld();
  window.location.href = '/';
}

export const getTokenTotalBot = () => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN) || sessionStorage.getItem(STORAGE_KEY_TOKEN)
  if (!token) {
    handleRemoveStorage()
    return null
  }
  return token
}

export const getTokenTotalDocs = () => {
  const token =
    localStorage.getItem(SESSION_TOTAL_DOCS) || sessionStorage.getItem(SESSION_TOTAL_DOCS)
  if (!token) {
    handleRemoveStorage()
    return null
  }
  return token
}
