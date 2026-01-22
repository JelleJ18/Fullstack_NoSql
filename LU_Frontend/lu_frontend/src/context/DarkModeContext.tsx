'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface DarkModeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Check saved preference first, then system preference
    const saved = localStorage.getItem('darkMode')
    let shouldBeDark = false

    if (saved !== null) {
      // User has a saved preference
      shouldBeDark = saved === 'true'
    } else {
      // No saved preference, use system preference
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    // Apply immediately
    const htmlElement = document.documentElement
    if (shouldBeDark) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }

    setIsDarkMode(shouldBeDark)
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (initialized) {
      // Save to localStorage whenever it changes
      localStorage.setItem('darkMode', isDarkMode.toString())
      
      // Update HTML element class and colorScheme
      const htmlElement = document.documentElement
      if (isDarkMode) {
        htmlElement.classList.add('dark')
        htmlElement.style.colorScheme = 'dark'
      } else {
        htmlElement.classList.remove('dark')
        htmlElement.style.colorScheme = 'light'
      }
    }
  }, [isDarkMode, initialized])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within DarkModeProvider')
  }
  return context
}
