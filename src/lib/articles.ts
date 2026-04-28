import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

export type Category = 'business' | 'ai' | 'software' | 'tech'

export interface Article {
  slug: string
  title: string
  date_written: string   // YYYY-MM-DD
  language: 'fr' | 'en'
  status: string
  tags: string[]
  category?: Category
  series?: string
  sources_factuelles?: string[]
  word_count?: string
  excerpt: string
  readingTime: number    // minutes
  coverColor: CoverColor
}

export interface ArticleFull extends Article {
  contentHtml: string
}

export type CoverColor = 'brick' | 'prussian' | 'ocher' | 'forest' | 'plum'

const COVER_COLORS: CoverColor[] = ['brick', 'prussian', 'ocher', 'forest', 'plum']

function pickColor(slug: string): CoverColor {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  return COVER_COLORS[hash % COVER_COLORS.length]
}

function estimateReadingTime(text: string): number {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200))
}

function makeExcerpt(text: string, words = 30): string {
  return text.replace(/^---[\s\S]*?---/, '').replace(/[#*`_\[\]]/g, '').trim()
    .split(/\s+/).slice(0, words).join(' ') + '…'
}

export function getArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []

  return fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf8')
      const { data, content } = matter(raw)
      const slug: string = data.slug ?? filename.replace(/\.md$/, '')
      return {
        slug,
        title: data.title ?? '',
        date_written: data.date_written instanceof Date
          ? data.date_written.toISOString().slice(0, 10)
          : String(data.date_written ?? ''),
        language: data.language ?? 'fr',
        status: data.status ?? '',
        tags: data.tags ?? [],
        category: data.category,
        series: data.series,
        sources_factuelles: data.sources_factuelles,
        word_count: data.word_count,
        excerpt: makeExcerpt(content),
        readingTime: estimateReadingTime(content),
        coverColor: pickColor(slug),
      } satisfies Article
    })
    .sort((a, b) => b.date_written.localeCompare(a.date_written))
}

export async function getArticle(slug: string): Promise<ArticleFull | null> {
  if (!fs.existsSync(ARTICLES_DIR)) return null

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'))
  const filename = files.find(f => {
    const { data } = matter(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8'))
    return (data.slug ?? f.replace(/\.md$/, '')) === slug
  })
  if (!filename) return null

  const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf8')
  const { data, content } = matter(raw)

  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content)
  const contentHtml = processed.toString()

  return {
    slug,
    title: data.title ?? '',
    date_written: data.date_written instanceof Date
      ? data.date_written.toISOString().slice(0, 10)
      : String(data.date_written ?? ''),
    language: data.language ?? 'fr',
    status: data.status ?? '',
    tags: data.tags ?? [],
    category: data.category,
    series: data.series,
    sources_factuelles: data.sources_factuelles,
    word_count: data.word_count,
    excerpt: makeExcerpt(content),
    readingTime: estimateReadingTime(content),
    coverColor: pickColor(slug),
    contentHtml,
  }
}
