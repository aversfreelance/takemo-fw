import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { shopCopy } from '../i18n/shop'

const steps = [
  { key: 'start', to: '/start' },
  { key: 'details', to: 'details' },
  { key: 'modules', to: 'modules' },
  { key: 'review', to: 'review' },
  { key: 'pay', to: 'pay' },
] as const

export function OrderSteps({ token, current }: { token?: string; current: (typeof steps)[number]['key'] }) {
  const { locale } = useLocale()
  const t = shopCopy(locale)
  const labels = [t.start, t.details, t.modules, t.review, t.pay]

  return (
    <ol className="order-steps">
      {steps.map((step, index) => {
        const href = step.key === 'start' ? '/start' : token ? `/order/${token}/${step.to}` : '/start'
        const active = step.key === current
        return (
          <li key={step.key} className={active ? 'is-on' : ''}>
            <Link to={href}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {labels[index]}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
