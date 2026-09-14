import { useLocale } from '../i18n/locale'
import { Reveal } from './Reveal'

const tones = ['is-a', 'is-c', 'is-d', 'is-e']

export function HowWeWork({ bare = false }: { bare?: boolean }) {
  const { copy } = useLocale()

  return (
    <section className="bg-wash py-24">
      <div className="page-wrap">
        {bare ? null : (
          <Reveal>
            <h2 className="max-w-3xl text-[clamp(2.2rem,6vw,5.2rem)] font-extrabold leading-[0.95]">
              {copy.workTitle}
            </h2>
          </Reveal>
        )}
        <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4${bare ? '' : ' mt-14'}`}>
          {copy.workSteps.map((step, index) => (
            <Reveal key={step.n} delay={index * 90} variant="zoom">
              <article className={`stage-card ${tones[index]} flex h-full min-h-72 flex-col justify-between`}>
                <p className="text-6xl font-black leading-none">{step.n}</p>
                <div>
                  <h3 className="text-3xl font-extrabold">{step.title}</h3>
                  <p className="mt-3 text-base leading-7">{step.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
