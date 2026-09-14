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

function guessFromDevice(): Locale {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (zone === 'Europe/Budapest') return 'hu'
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('hu')) return 'hu'
  return 'en'
}

function readSaved(): Locale | null {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'hu' || saved === 'en' ? saved : null
}

async function countryFromIp(): Promise<string | null> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 2500)
  try {
    const res = await fetch('https://ipwho.is/?fields=success,country_code', { signal: controller.signal })
    const data = (await res.json()) as { success?: boolean; country_code?: string }
    if (data.success && data.country_code) return data.country_code.toUpperCase()
  } catch {
    try {
      const res = await fetch('https://get.geojs.io/v1/ip/country.json', { signal: controller.signal })
      const data = (await res.json()) as { country?: string }
      if (data.country) return data.country.toUpperCase()
    } catch {
      return null
    }
  } finally {
    window.clearTimeout(timer)
  }
  return null
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readSaved() ?? guessFromDevice())
  const [ready, setReady] = useState(() => Boolean(readSaved()))

  useEffect(() => {
    if (readSaved()) {
      setReady(true)
      return
    }

    let cancelled = false
    countryFromIp().then((country) => {
      if (cancelled || readSaved()) return
      if (country === 'HU') setLocaleState('hu')
      else if (country) setLocaleState('en')
      setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = copies[locale].htmlLang
    document.title = copies[locale].title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', copies[locale].description)
  }, [locale])

  const setLocale = (next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next)
    setLocaleState(next)
    setReady(true)
  }

  const value = useMemo(
    () => ({ locale, copy: copies[locale], setLocale, ready }),
    [locale, ready],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
