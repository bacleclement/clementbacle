import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Senior fullstack engineer, ex-fondateur (Oscare, 12 personnes, exited). Actuellement chez Hublo. J\'écris sur le logiciel, l\'IA et l\'entrepreneuriat.',
  alternates: { canonical: 'https://clementbacle.com/about' },
  openGraph: {
    title: 'À propos — Clément Bacle',
    description: 'Senior fullstack engineer, ex-fondateur (Oscare, 12 personnes, exited). Actuellement chez Hublo.',
    url: 'https://clementbacle.com/about',
  },
}

export default function AboutPage() {
  return <AboutContent />
}
