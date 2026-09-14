import { Link } from 'react-router-dom'
import { company } from '../data'
import { useLocale } from '../i18n/locale'
import { LangSwitch } from './LangSwitch'
import { Logo } from './Logo'

export function Footer() {
  const { copy } = useLocale()

  return (
    <footer className="bg-white">
      <div className="page-wrap grid gap-10 py-16 md:grid-cols-3">
        <div>
          <Logo footer />
          <p className="mt-4 max-w-xs text-sm leading-6 text-ink">{copy.footerTag}</p>
          <div className="mt-5">
            <LangSwitch />
          </div>
        </div>
        <div>
          <h3 className="footer-title">{copy.footerContact}</h3>
          <ul className="space-y-2 text-sm text-ink">
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-brand">
                {company.email}
              </a>
            </li>
            <li>{company.office}</li>
            <li>{copy.footerAlso}</li>
            <li>{copy.footerHours}</li>
          </ul>
        </div>
        <div>
          <h3 className="footer-title">{copy.footerExplore}</h3>
          <ul className="space-y-2 text-sm uppercase text-ink">
            {copy.nav.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="page-wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs uppercase text-muted">
          <p>
            © {new Date().getFullYear()} Take Mee Online. {copy.footerRights}
          </p>
          <Link to="/privacy" className="hover:text-brand">
            {copy.privacy}
          </Link>
        </div>
      </div>
    </footer>
  )
}
