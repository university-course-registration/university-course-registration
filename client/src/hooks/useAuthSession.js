import { useMemo } from 'react'
import storageKeys from '../constants/storageKeys.js'

function useAuthSession() {
  const raw = sessionStorage.getItem(storageKeys.auth)
  const auth = raw ? JSON.parse(raw) : null

  const user = useMemo(() => auth?.user || null, [auth])
  const token = useMemo(() => auth?.token || null, [auth])

  const setAuth = (nextAuth) => {
    if (!nextAuth) {
      sessionStorage.removeItem(storageKeys.auth)
      return null
    }
    sessionStorage.setItem(storageKeys.auth, JSON.stringify(nextAuth))
    return nextAuth
  }

  const clearAuth = () => {
    sessionStorage.removeItem(storageKeys.auth)
  }

  const updateUser = (updatedUser) => {
    if (auth) {
      const updatedAuth = { ...auth, user: { ...auth.user, ...updatedUser } }
      sessionStorage.setItem(storageKeys.auth, JSON.stringify(updatedAuth))
    }
  }

  return {
    auth,
    user,
    token,
    setAuth,
    clearAuth,
    updateUser,
  }
}

export default useAuthSession
