import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/locale'

const KEY = 'takemo-cookie-consent'

export function CookieBanner() {
  const { copy } = useLocale()
  const [visible, setVisible] = useState(false)
  const [openDetails, setOpenDetails] = useState(false)

  useEffect(() => {
    setVisible(!localStorage.getItem(KEY))
  }, [])

  function save(value: string) {
    localStorage.setItem(KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4">
      <div className="mx-auto max-w-4xl rounded-[10px] bg-navy p-5 text-white shadow-2xl">
        <p className="text-sm leading-6">{copy.cookies}</p>
        {openDetails && (
          <div className="mt-4 grid gap-2 text-xs text-white/80 md:grid-cols-2">
            {copy.cookiesMore.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={() => save('all')}>
            {copy.accept}
          </button>
          <button type="button" className="btn-outline border-white text-white hover:bg-white hover:text-navy" onClick={() => save('essential')}>
            {copy.reject}
          </button>
          <button
            type="button"
            className="btn-outline border-white text-white hover:bg-white hover:text-navy"
            onClick={() => setOpenDetails((v) => !v)}
          >
            {openDetails ? copy.less : copy.customise}
          </button>
        </div>
      </div>
    </div>
  )
}
