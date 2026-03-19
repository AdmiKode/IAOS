'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { MockUser, UserRole } from '@/types'
import { DEMO_CREDENTIALS, DEMO_USERS } from '@/data/mock'

interface AuthContextType {
  user: MockUser | null
  login: (email: string, password: string) => { success: boolean; redirect: string; error?: string }
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('iaos_demo_user')
    if (saved) setUser(JSON.parse(saved))
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    const cred = DEMO_CREDENTIALS.find(c => c.email === email && c.password === password)
    if (!cred) return { success: false, redirect: '', error: 'Credenciales incorrectas. Usa las credenciales demo.' }
    const foundUser = DEMO_USERS.find(u => u.email === email)!
    setUser(foundUser)
    localStorage.setItem('iaos_demo_user', JSON.stringify(foundUser))
    // Cookie para middleware (SameSite=Lax, no HttpOnly para demo)
    document.cookie = `iaos-user=${encodeURIComponent(JSON.stringify(foundUser))};path=/;max-age=86400;SameSite=Lax`
    return { success: true, redirect: cred.redirect }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('iaos_demo_user')
    document.cookie = 'iaos-user=;path=/;max-age=0'
  }

  // Restaurar cookie si hay sesión en localStorage
  useEffect(() => {
    if (user) {
      document.cookie = `iaos-user=${encodeURIComponent(JSON.stringify(user))};path=/;max-age=86400;SameSite=Lax`
    }
  }, [user])

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
