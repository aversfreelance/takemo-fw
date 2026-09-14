import { Essay } from '../components/Essay'
import { HelpGrid } from '../components/HelpGrid'
import { Hero } from '../components/Hero'
import { Journey } from '../components/Journey'
import { PaySplit } from '../components/PaySplit'
import { Punch } from '../components/Punch'
import { QuoteCta } from '../components/QuoteCta'

export function Home() {
  return (
    <div className="page-enter">
      <Hero />
      <Essay afterHero />
      <Punch />
      <Journey />
      <HelpGrid />
      <PaySplit bare />
      <QuoteCta />
    </div>
  )
}
