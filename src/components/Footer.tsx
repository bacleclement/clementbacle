'use client'

import { usePathname } from 'next/navigation'
import { useLang } from '@/i18n/context'

export default function Footer() {
  const pathname = usePathname()
  const { t } = useLang()
  if (pathname.startsWith('/lab')) return null

  const colophonLines = t.footer.setIn.split('\n')

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__cols">
          <div className="footer__col">
            <b>{t.footer.elsewhere}</b>
            <a href="#">github / clementbacle</a>
            <a href="#">x / clementbacle</a>
            <a href="#">bluesky / clementbacle</a>
          </div>
          <div className="footer__col">
            <b>{t.footer.feed}</b>
            <a href="#">/writing/rss.xml</a>
            <a href="#">/writing/atom.xml</a>
          </div>
          <div className="footer__col">
            <b>{t.footer.colophon}</b>
            <span>
              {colophonLines[0]}<br />{colophonLines[1]}
            </span>
            <span>{t.footer.builtWith}</span>
          </div>
        </div>
        <div className="footer__prompt">
          ~ $ <span className="cursor"></span>
        </div>
      </div>
    </footer>
  )
}
