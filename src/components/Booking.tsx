import { useMemo, useState } from 'react'
import { hours } from '../data'
import { useUi } from '../context/ui'
import { getVisibleDays, slotStatus } from '../lib/dates'
import { Reveal } from './Reveal'

export function Booking() {
  const { openQuote } = useUi()
  const [offset, setOffset] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const days = useMemo(() => getVisibleDays(offset), [offset])

  return (
    <section className="bg-white py-20" id="book">
      <div className="page-wrap">
        <Reveal>
          <h2 className="section-title">
            Book a <strong>call</strong>
          </h2>
          <p className="section-sub mx-auto max-w-3xl">
            Thirty minutes, no charge — website, hosting or a full management plan. Prefer to write? Send a message.
          </p>
        </Reveal>
        <Reveal className="mt-6 text-center">
          <button type="button" className="btn-primary" onClick={openQuote}>
            Send a message
          </button>
        </Reveal>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button type="button" className="btn-outline" onClick={() => setOffset((v) => Math.max(0, v - 7))} disabled={offset === 0}>
            Previous
          </button>
          <button type="button" className="btn-outline" onClick={() => setOffset((v) => v + 7)}>
            Next days
          </button>
        </div>

        <div className="mt-5 overflow-x-auto border border-line bg-white">
          <table className="min-w-[860px] w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-wash text-ink">
                <th className="px-3 py-3 font-semibold uppercase">Time</th>
                {days.map((day) => (
                  <th key={day.key} className="px-2 py-3">
                    <div className="text-xs uppercase tracking-wider text-muted">{day.weekday}</div>
                    <div className="font-semibold">{day.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour} className="border-t border-line">
                  <th className="whitespace-nowrap bg-wash px-3 py-2 text-left font-semibold">{hour}</th>
                  {days.map((day) => {
                    const status = slotStatus(day, hour)
                    const key = `${day.key}|${hour}`
                    const isSelected = selected === key
                    if (status === 'closed') {
                      return (
                        <td key={key} className="px-2 py-2 text-muted/40">
                          —
                        </td>
                      )
                    }
                    if (status === 'meeting') {
                      return (
                        <td key={key} className="px-2 py-2 text-xs font-semibold text-muted">
                          meeting
                        </td>
                      )
                    }
                    if (status === 'lunch') {
                      return (
                        <td key={key} className="px-2 py-2 text-xs font-semibold text-muted">
                          lunch
                        </td>
                      )
                    }
                    return (
                      <td key={key} className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => setSelected(key)}
                          className={`w-full rounded-[5px] px-2 py-2 text-xs font-bold uppercase transition ${
                            isSelected ? 'bg-brand text-white' : 'bg-wash text-ink hover:bg-brand-soft hover:text-white'
                          }`}
                        >
                          free
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <p className="mt-4 text-sm font-medium">
            Selected: {selected.replace('|', ' · ')}
            <button type="button" className="ml-3 text-brand underline" onClick={openQuote}>
              Continue to the form
            </button>
          </p>
        )}
      </div>
    </section>
  )
}
