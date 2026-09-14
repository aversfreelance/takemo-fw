import { useLocale } from '../i18n/locale'

export function Punch() {
  const { copy } = useLocale()

  return (
    <section className="punch" aria-label={copy.punchNote}>
      <div className="punch-cell punch-left">
        <div>
          <p className="punch-word">{copy.punchLeft}</p>
        </div>
      </div>
      <div className="punch-cell punch-right">
        <div>
          <p className="punch-word">{copy.punchRight}</p>
          <p className="punch-note mt-6 text-base font-extrabold uppercase tracking-[0.22em]">{copy.punchNote}</p>
        </div>
      </div>
    </section>
  )
}
