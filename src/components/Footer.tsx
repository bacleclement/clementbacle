export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer__cols">
          <div className="footer__col">
            <b>elsewhere</b>
            <a href="#">github / clementbacle</a>
            <a href="#">x / clementbacle</a>
            <a href="#">bluesky / clementbacle</a>
          </div>
          <div className="footer__col">
            <b>feed</b>
            <a href="#">/writing/rss.xml</a>
            <a href="#">/writing/atom.xml</a>
          </div>
          <div className="footer__col">
            <b>colophon</b>
            <span>set in newsreader<br />&amp; jetbrains mono</span>
            <span>built with next.js</span>
          </div>
        </div>
      </div>
      <div className="footer__prompt">
        ~ $ <span className="cursor"></span>
      </div>
    </footer>
  );
}
