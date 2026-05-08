import type { Metadata } from 'next'
import ProjectsContent from './ProjectsContent'

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Projets sélectionnés : Kitt (moteur de workflows IA), ClaudIn (automatisation LinkedIn open-source), Hive (framework multi-agents NestJS).',
  alternates: { canonical: 'https://clementbacle.com/projects' },
  openGraph: {
    title: 'Projets — Clément Bacle',
    description: 'Projets sélectionnés : Kitt, ClaudIn, Hive — outillage IA et moteurs de workflows.',
    url: 'https://clementbacle.com/projects',
  },
}

export default function ProjectsPage() {
  return <ProjectsContent />
}
