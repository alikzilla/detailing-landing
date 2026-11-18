import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import SplitWords from '../components/SplitWords';
import MagneticButton from '../components/MagneticButton';
import s from './Statement.module.css';

/** Paragraph lights up word by word with scroll; side image drifts (parallax). */
export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const heading = `.${s.heading}`;
      gsap.to(`${heading} [data-word]`, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: heading, start: 'top 80%', end: 'bottom 40%', scrub: true } });
      gsap.fromTo(`.${s.img}`, { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: `.${s.imgWrap}`, start: 'top bottom', end: 'bottom top', scrub: true } });
    },
    { scope: root },
  );

  return (
    <section className={s.statement} ref={root}>
      <div>
        <h2 className={s.heading}><SplitWords text="A car should feel finished before the engine turns. Every seam, edge and surface earns its place." /></h2>
        <p className={s.body}>Styling, interiors, lighting and protection, planned together so each one makes the others look better without shouting over them.</p>
        <MagneticButton href="#services">See services</MagneticButton>
      </div>
      <div className={s.imgWrap}>
        <Placeholder className={s.img} tag n="08" text="Forged wheel and carbon brake detail, low angle, portrait crop" />
      </div>
    </section>
  );
}
