import { useEffect, useState } from 'react'
import storageKeys from '../constants/storageKeys.js'

function useRegistrationMode() {
  const [mode, setMode] = useState(
    () => sessionStorage.getItem(storageKeys.registrationMode) || null
  )

  const enableUpdateMode = () => {
    sessionStorage.setItem(storageKeys.registrationMode, 'update')
    setMode('update')
  }

  const clearMode = () => {
    sessionStorage.removeItem(storageKeys.registrationMode)
    setMode(null)
  }

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key && event.key !== storageKeys.registrationMode) {
        return
      }
      setMode(sessionStorage.getItem(storageKeys.registrationMode) || null)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return {
    mode,
    isUpdateMode: mode === 'update',
    enableUpdateMode,
    clearMode,
  }
}

export default useRegistrationMode
