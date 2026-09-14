import { useLocale } from '../i18n/locale'
import { Reveal } from './Reveal'

export function Punch() {
  const { copy } = useLocale()

  return (
    <section className="punch" aria-label={copy.punchNote}>
      <Reveal variant="left" className="punch-cell punch-left">
        <div>
          <p className="punch-word">{copy.punchLeft}</p>
        </div>
      </Reveal>
      <Reveal variant="right" className="punch-cell punch-right">
        <div>
          <p className="punch-word">{copy.punchRight}</p>
          <p className="mt-6 text-base font-extrabold uppercase tracking-[0.22em] text-[#ffd24a]">{copy.punchNote}</p>
        </div>
      </Reveal>
    </section>
  )
}
