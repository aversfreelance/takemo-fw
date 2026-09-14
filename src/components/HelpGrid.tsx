import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/locale'
import { Reveal } from './Reveal'

export function HelpGrid() {
  const { copy } = useLocale()

  return (
    <section className="bg-white py-24" id="help">
      <div className="page-wrap">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {copy.helpCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 70} variant="zoom" className="h-full">
              <Link
                to={card.href}
                className={`help-card help-${index % 6} flex h-full min-h-44 items-center p-8 no-underline`}
              >
                <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-extrabold leading-[1.05]">{card.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
