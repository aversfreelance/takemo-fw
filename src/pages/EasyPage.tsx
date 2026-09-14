import { ChapterPage } from '../components/ChapterPage'
import { EasyBanner } from '../components/EasyBanner'
import { useLocale } from '../i18n/locale'

export function EasyPage() {
  const { copy } = useLocale()
  return <ChapterPage chapter={copy.chapters[3]} visual={<EasyBanner bare />} />
}
