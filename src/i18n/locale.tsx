import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { copies, type Copy, type Locale } from './copy'

const STORAGE_KEY = 'takemo-lang'

type LocaleContextValue = {
  locale: Locale
  copy: Copy
  setLocale: (locale: Locale) => void
  ready: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function localeFromHost(host = window.location.hostname): Locale | null {
  const name = host.toLowerCase()
  if (name === 'hu' || name.endsWith('.hu')) return 'hu'
  if (name.endsWith('.co.uk')) return 'en'
  return null
}

function readSaved(): Locale | null {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'hu' || saved === 'en' ? saved : null
}

function initialLocale(): Locale {
  return localeFromHost() ?? readSaved() ?? 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    const fromHost = localeFromHost()
    if (fromHost) setLocaleState(fromHost)
  }, [])

  useEffect(() => {
    document.documentElement.lang = copies[locale].htmlLang
    document.title = copies[locale].title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', copies[locale].description)
  }, [locale])

  const setLocale = (next: Locale) => {
    if (!localeFromHost()) localStorage.setItem(STORAGE_KEY, next)
    setLocaleState(next)
  }

  const value = useMemo(
    () => ({ locale, copy: copies[locale], setLocale, ready: true }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
