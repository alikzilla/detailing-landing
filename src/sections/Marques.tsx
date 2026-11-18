import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import MagneticButton from '../components/MagneticButton';
import s from './Marques.module.css';

const logos = ['L1', 'L2', 'L3', 'L4', 'L5'];

export default function Marques() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(`.${s.logo}`, { opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } });
    },
    { scope: root },
  );

  return (
    <section className={s.marques} ref={root}>
      <div>
        <p className={`eyebrow ${s.eyebrow}`}>Marques we work with</p>
        <div className={s.row}>
          {logos.map((n) => <Placeholder key={n} logo className={s.logo} n={n} />)}
        </div>
        <p className={s.note}>L1–L5: brand logos in white, round badges (placeholders)</p>
      </div>
      <div>
        <p className={s.lead}>We sweat the parts nobody points at, so the whole car reads as one considered idea, from your first sketch to the day you collect the keys.</p>
        <MagneticButton href="#contact">Book a consultation</MagneticButton>
      </div>
    </section>
  );
}
