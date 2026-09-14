import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
          renderButton: (el: HTMLElement, config: { theme: string; size: string; width: number }) => void
        }
      }
    }
  }
}

export function LoginPage() {
  const { copy, locale } = useLocale()
  const t = shopCopy(locale)
  const { setSession, googleClientId, user } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = params.get('next') || '/account'
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const googleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) navigate(next, { replace: true })
  }, [user, next, navigate])

  useEffect(() => {
    if (!googleClientId || !googleRef.current) return
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            const data = await api.googleLogin(response.credential)
            setSession(data.token, data.user)
            navigate(next, { replace: true })
          } catch {
            setError('google')
          }
        },
      })
      if (googleRef.current) {
        googleRef.current.innerHTML = ''
        window.google?.accounts.id.renderButton(googleRef.current, { theme: 'outline', size: 'large', width: 320 })
      }
    }
    document.body.appendChild(script)
    return () => script.remove()
  }, [googleClientId, navigate, next, setSession])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '')
    const password = String(data.get('password') || '')
    const name = String(data.get('name') || '')
    setError('')
    try {
      const result =
        mode === 'register'
          ? await api.register({ name, email, password })
          : await api.userLogin({ email, password })
      setSession(result.token, result.user)
      navigate(next, { replace: true })
    } catch {
      setError('login')
    }
  }

  return (
    <div className="page-enter">
      <PageHero title={mode === 'register' ? t.register : t.login}>{t.needAccount}</PageHero>
      <section className="bg-wash pb-24">
        <div className="page-wrap max-w-md">
          <div className="mb-6 flex gap-2">
            <button type="button" className={mode === 'login' ? 'btn-primary' : 'btn-outline'} onClick={() => setMode('login')}>
              {t.login}
            </button>
            <button type="button" className={mode === 'register' ? 'btn-primary' : 'btn-outline'} onClick={() => setMode('register')}>
              {t.register}
            </button>
          </div>
          <form className="grid gap-3" onSubmit={(event) => void onSubmit(event)}>
            {mode === 'register' ? <input required name="name" placeholder={copy.name} className="field" /> : null}
            <input required type="email" name="email" placeholder={copy.email} className="field" />
            <input required type="password" name="password" placeholder={t.password} minLength={6} className="field" />
            {error ? <p className="font-bold text-brand">{t.loginFail}</p> : null}
            <button type="submit" className="btn-primary w-fit">
              {mode === 'register' ? t.register : t.login}
            </button>
          </form>
          {googleClientId ? (
            <div className="mt-8">
              <p className="mb-3 font-bold">{t.google}</p>
              <div ref={googleRef} />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
