import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav" aria-label="primary">
      <div className="nav__brand">
        <b>Clément Bacle</b>
      </div>
      <div className="nav__links">
        <Link className="nav-link" href="/">~/home</Link>
        <Link className="nav-link" href="/writing">~/writing</Link>
        <Link className="nav-link" href="/projects">~/projects</Link>
        <Link className="nav-link" href="/about">~/about</Link>
      </div>
      <div className="nav__tools">
        <button className="icon-btn" id="lang">FR · en</button>
        <button className="icon-btn" id="theme" title="Toggle theme">◐ dark</button>
      </div>
    </nav>
  );
}
