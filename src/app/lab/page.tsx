import type { Metadata } from 'next'
import LabContent from './LabContent'

export const metadata: Metadata = {
  title: 'Lab',
  description: 'Expériences interactives à l\'intersection de l\'IA, des agents et du logiciel.',
  alternates: { canonical: 'https://clementbacle.com/lab' },
  openGraph: {
    title: 'Lab — Clément Bacle',
    description: 'Expériences interactives à l\'intersection de l\'IA, des agents et du logiciel.',
    url: 'https://clementbacle.com/lab',
  },
}

export default function LabPage() {
  return <LabContent />
}
