import type { Metadata } from 'next'
import { getArticles } from '@/lib/articles'
import WritingContent from './WritingContent'

export const metadata: Metadata = {
  title: 'Écriture',
  description: 'Essais à l\'intersection du génie logiciel, de l\'entrepreneuriat et des workflows IA — de l\'architecture à la stratégie.',
  alternates: { canonical: 'https://clementbacle.com/writing' },
  openGraph: {
    title: 'Écriture — Clément Bacle',
    description: 'Essais à l\'intersection du génie logiciel, de l\'entrepreneuriat et des workflows IA.',
    url: 'https://clementbacle.com/writing',
  },
}

export default function WritingPage() {
  return <WritingContent articles={getArticles()} />
}
