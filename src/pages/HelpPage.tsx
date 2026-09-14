import { ChapterPage } from '../components/ChapterPage'
import { HelpGrid } from '../components/HelpGrid'
import { useLocale } from '../i18n/locale'

export function HelpPage() {
  const { copy } = useLocale()
  return <ChapterPage chapter={copy.chapters[1]} visual={<HelpGrid />} />
}
