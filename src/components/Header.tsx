import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'
import { useAuth } from '../lib/auth'
import { LangSwitch } from './LangSwitch'
import { Logo } from './Logo'

export function Header() {
  const { copy, locale } = useLocale()
  const t = shopCopy(locale)
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="page-wrap flex items-center justify-between py-5">
          <Logo />
          <nav className="hidden items-center gap-5 xl:flex">
            {copy.nav.slice(0, 4).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-[15px] font-bold uppercase tracking-[0.12em] transition hover:text-brand ${
                    isActive && !link.to.includes('#') ? 'text-brand' : 'text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user?.admin ? (
              <Link to="/admin" className="btn-primary h-11 px-5 text-xs">
                {t.admin}
              </Link>
            ) : null}
            <Link
              to={user ? '/account' : '/login'}
              className="hidden text-[12px] font-bold uppercase tracking-[0.14em] text-ink hover:text-brand sm:inline"
            >
              {user ? t.account : t.login}
            </Link>
            <LangSwitch />
            <button
              type="button"
              className="hamburger-btn ml-1 grid h-[56px] w-[56px] place-items-center rounded-full border border-brand bg-brand text-white"
              aria-label="Menu"
              onClick={() => setOpen(true)}
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-[3px] w-6 bg-white" />
                <span className="block h-[3px] w-6 bg-white" />
                <span className="block h-[3px] w-6 bg-white" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="menu-panel fixed inset-0 z-[90] bg-menu text-white">
          <button
            type="button"
            className="absolute right-6 top-6 text-4xl leading-none text-white"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <div className="flex h-full flex-col">
            <div className="flex flex-col items-center gap-6 bg-[#070b16] py-14">
              <Logo light />
              <LangSwitch light />
            </div>
            <nav className="flex flex-1 flex-col justify-center">
              {copy.nav.map((link, index) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  style={{ animationDelay: `${120 + index * 70}ms` }}
                  className="menu-link px-10 py-4 text-xl font-semibold uppercase tracking-[0.12em] text-white hover:text-brand-soft"
                >
                  {link.label}
                </NavLink>
              ))}
              {user?.admin ? (
                <NavLink to="/admin" className="menu-link px-10 py-4 text-xl font-semibold uppercase tracking-[0.12em] text-[#ffd24a]">
                  {t.admin}
                </NavLink>
              ) : null}
              <NavLink
                to={user ? '/account' : '/login'}
                className="menu-link px-10 py-4 text-xl font-semibold uppercase tracking-[0.12em] text-white hover:text-brand-soft"
              >
                {user ? t.account : t.login}
              </NavLink>            </nav>
          </div>
        </div>
      )}
    </>
  )
}
