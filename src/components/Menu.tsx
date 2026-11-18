import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from './Placeholder';
import { contact, navLinks } from '../data/content';
import s from './Menu.module.css';

/** Full-screen overlay: clip-path wipe down, links slide up one after another. */
export default function Menu({ open }: { open: boolean }) {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline>();

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .to(root.current, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
        .to(`.${s.label}`, { y: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out' }, '-=.4')
        .from(`.${s.side}`, { opacity: 0, duration: 0.6 }, '-=.6');
    },
    { scope: root },
  );

  useGSAP(() => {
    if (!tl.current) return;
    if (open) tl.current.timeScale(1).play();
    else tl.current.timeScale(1.6).reverse();
  }, { dependencies: [open] });

  return (
    <nav className={s.menu} ref={root} aria-hidden={!open}>
      <div className={s.links}>
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} tabIndex={open ? 0 : -1}><span className={s.label}>{l.label}</span></a>
        ))}
      </div>
      <div className={s.side}>
        <Placeholder className={s.sideImg} tag n="M1" text="Фото для меню: атмосферный цех, машина под одной лампой сверху" />
        <div className={s.meta}><span>{contact.email}</span><span>{contact.hours}</span></div>
      </div>
    </nav>
  );
}
