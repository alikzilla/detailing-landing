import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import MagneticButton from '../components/MagneticButton';
import { projects } from '../data/content';
import s from './ProjectsTeaser.module.css';

const shots = [
  { n: '13', text: 'Внедорожник, вид сверху, на чёрном' },
  { n: '14', text: 'Главный спорткар, вид сверху, на чёрном', center: true },
  { n: '15', text: 'Рамный внедорожник, вид сверху, на чёрном' },
];

/** One-screen projects teaser: top-down cars zoom and spread as the section passes, link to the full list. */
export default function ProjectsTeaser() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const car = `.${s.car}`;
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 } })
        .fromTo(`.${s.center}`, { scale: 0.6 }, { scale: 1.1, ease: 'none' }, 0)
        .fromTo(`${car}:nth-child(1)`, { xPercent: 40, scale: 0.6 }, { xPercent: -30, scale: 1, ease: 'none' }, 0)
        .fromTo(`${car}:nth-child(3)`, { xPercent: -40, scale: 0.6 }, { xPercent: 30, scale: 1, ease: 'none' }, 0);
    },
    { scope: root },
  );

  return (
    <section className={s.section} id="builds" ref={root}>
      {shots.map((c) => (
        <Placeholder key={c.n} className={`${s.car} ${c.center ? s.center : ''}`} n={c.n} text={c.text} />
      ))}
      <div className={s.overlay}>
        <p className="eyebrow">Проекты · {projects.length}</p>
        <h2 className={s.heading}>Последние работы</h2>
        <MagneticButton href="/projects">Все проекты</MagneticButton>
      </div>
    </section>
  );
}
