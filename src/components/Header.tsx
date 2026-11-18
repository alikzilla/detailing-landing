import { useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Logo from './Logo';
import { socials } from '../data/content';
import s from './Header.module.css';

type Props = { menuOpen: boolean; onToggleMenu: () => void };

/** Fixed header with difference blending; the brand word appears under the logo after 200px of scroll. */
export default function Header({ menuOpen, onToggleMenu }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({ start: 200, end: 'max', onToggle: (self) => setScrolled(self.isActive) });
  });

  return (
    <header className={`${s.header} ${scrolled ? s.showWord : ''}`}>
      <div className={s.social}>
        {socials.map((x) => (
          <a key={x.short} href={x.href} aria-label={x.label}>{x.short}</a>
        ))}
      </div>
      <a href="#top" className={s.logo} aria-label="Home">
        <Logo />
        <small className={s.word}>VANTA</small>
      </a>
      <button className={`${s.menuBtn} ${menuOpen ? s.open : ''}`} aria-expanded={menuOpen} onClick={onToggleMenu}>
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
        <span className={s.burger}><i /><i /></span>
      </button>
    </header>
  );
}
