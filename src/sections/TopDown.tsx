import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import { topDown } from '../data/content';
import s from './TopDown.module.css';

/** Pinned: centre car zooms in while the side cars spread out. */
export default function TopDown() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const car = `.${s.car}`;
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=120%', scrub: 1, pin: true } })
        .fromTo(`.${s.center}`, { scale: 0.6 }, { scale: 1.1, ease: 'none' }, 0)
        .fromTo(`${car}:nth-child(1)`, { xPercent: 40, scale: 0.6 }, { xPercent: -30, scale: 1, ease: 'none' }, 0)
        .fromTo(`${car}:nth-child(3)`, { xPercent: -40, scale: 0.6 }, { xPercent: 30, scale: 1, ease: 'none' }, 0);
    },
    { scope: root },
  );

  return (
    <section className={s.topdown} id="builds" ref={root}>
      {topDown.map((c) => (
        <Placeholder key={c.n} className={`${s.car} ${c.center ? s.center : ''}`} n={c.n} text={c.text} />
      ))}
      <p className={`eyebrow ${s.label}`}>Recent builds</p>
    </section>
  );
}
