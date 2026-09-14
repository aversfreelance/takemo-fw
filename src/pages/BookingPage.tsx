import { Booking } from '../components/Booking'
import { Reveal } from '../components/Reveal'
import { useLocale } from '../i18n/locale'

export function BookingPage() {
  const { copy } = useLocale()

  return (
    <div className="page-enter">
      <section className="bg-[#ffd24a] pt-36 pb-16">
        <Reveal className="page-wrap">
          <h1 className="max-w-5xl text-[clamp(2.6rem,7vw,6.4rem)] font-extrabold leading-[0.92]">{copy.book}</h1>
          <p className="mt-6 max-w-xl text-xl leading-8">{copy.contactLead}</p>
        </Reveal>
      </section>
      <Booking />
    </div>
  )
}
