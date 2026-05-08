import { getArticles } from '@/lib/articles'
import HomeContent from './HomeContent'

export default function HomePage() {
  const articles = getArticles()
  return <HomeContent latest={articles.slice(0, 3)} totalCount={articles.length} />
}
