import { useLocale } from '../i18n/locale'

export function LangSwitch({ light = false }: { light?: boolean }) {
  const { locale, setLocale } = useLocale()
  const idle = light ? 'text-white/55 hover:text-white' : 'text-ink/45 hover:text-ink'
  const on = light ? 'text-white' : 'text-ink'

  return (
    <div className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.16em]">
      <button type="button" className={locale === 'hu' ? on : idle} onClick={() => setLocale('hu')}>
        HU
      </button>
      <span className={light ? 'text-white/30' : 'text-ink/25'}>/</span>
      <button type="button" className={locale === 'en' ? on : idle} onClick={() => setLocale('en')}>
        EN
      </button>
    </div>
  )
}
