'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fr, type Dict } from './fr'
import { en } from './en'

export type Lang = 'fr' | 'en'

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Dict
}

const LangContext = createContext<LangContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: fr,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'fr' || stored === 'en') setLangState(stored)
  }, [])

  function setLang(next: Lang) {
    setLangState(next)
    localStorage.setItem('lang', next)
  }

  const t = lang === 'fr' ? fr : en

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
