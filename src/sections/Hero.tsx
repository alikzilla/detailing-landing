import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import SplitWords from '../components/SplitWords';
import { heroCars } from '../data/content';
import s from './Hero.module.css';

/** Pinned hero: cars brighten and spread on scroll; headline blurs in once the loader is gone. */
export default function Hero({ entered }: { entered: boolean }) {
  const root = useRef<HTMLElement>(null);
  const car = `.${s.car}`;

  // scroll-driven part (set up immediately)
  useGSAP(
    () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=120%', scrub: 1, pin: true } })
        .to(car, { filter: 'brightness(1)', ease: 'none' }, 0)
        .to(`${car}:nth-child(1)`, { xPercent: -30, scale: 1.15 }, 0)
        .to(`${car}:nth-child(3)`, { xPercent: 30, scale: 1.15 }, 0)
        .to(`${car}:nth-child(2)`, { scale: 1.35, y: '6vh' }, 0)
        .to(`.${s.title}`, { y: '-8vh', opacity: 0, filter: 'blur(10px)' }, 0.1)
        .to([`.${s.sub}`, `.${s.scroll}`], { opacity: 0 }, 0)
        .fromTo(`.${s.bigword}`, { yPercent: 40 }, { yPercent: 0 }, 0);
    },
    { scope: root },
  );

  // entrance (runs when the loader finishes)
  useGSAP(
    () => {
      if (!entered) return;
      gsap
        .timeline()
        // Start values come from CSS (.cars is shifted down, each .car is transparent), so nothing jumps
        // when this runs. The wrapper carries the slide and each car only fades: the scroll timeline above
        // owns the cars' transform and filter.
        .to(`.${s.cars}`, { y: 0, duration: 1.4, ease: 'power3.out' })
        .to(car, { opacity: 1, stagger: 0.12, duration: 1.2, ease: 'power2.out' }, 0)
        .to(`.${s.title} [data-word]`, { opacity: 1, filter: 'blur(0px)', stagger: 0.07, duration: 1, ease: 'power2.out' }, 0.3)
        .to(`.${s.sub}`, { opacity: 1, duration: 1 }, '-=.5');
    },
    { scope: root, dependencies: [entered] },
  );

  return (
    <section className={s.hero} id="top" ref={root}>
      <div className={s.bigword}>VANTA</div>
      <div className={s.cars}>
        {heroCars.map((c) => <Placeholder key={c.n} className={s.car} n={c.n} text={c.text} />)}
      </div>
      <div className={s.title}><h1><SplitWords text={'Для тех, кто\nзамечает всё'} /></h1></div>
      <p className={s.sub}>Независимая студия индивидуального стайлинга, интерьеров и защиты.</p>
      <div className={s.scroll} />
    </section>
  );
}
