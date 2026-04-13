import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('hash21-lang')
    if (saved && (saved === 'es' || saved === 'en')) return saved
    
    // Check browser language
    const browserLang = navigator.language?.slice(0, 2)
    return browserLang === 'en' ? 'en' : 'es'
  })

  useEffect(() => {
    localStorage.setItem('hash21-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = (key) => {
    return translations[lang]?.[key] || translations['es'][key] || key
  }

  const toggleLang = () => {
    setLang(prev => prev === 'es' ? 'en' : 'es')
  }

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LangContext)
  if (!context) {
    throw new Error('useLang must be used within LangProvider')
  }
  return context
}
