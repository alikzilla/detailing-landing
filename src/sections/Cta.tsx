import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import SplitWords from '../components/SplitWords';
import MagneticButton from '../components/MagneticButton';
import s from './Cta.module.css';

export default function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(`.${s.heading} [data-word]`, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.12, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 55%' } });
      gsap.fromTo(`.${s.bg}`, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true } });
    },
    { scope: root },
  );

  return (
    <section className={s.cta} id="contact" ref={root}>
      <div className={s.bg}>
        <Placeholder className={s.bgImg} /><Placeholder className={s.bgImg} /><Placeholder className={s.bgImg} />
      </div>
      <p className="eyebrow">Когда будете готовы</p>
      <h2 className={s.heading}><SplitWords text={'Сделаем её\nнеповторимой'} /></h2>
      <MagneticButton href="#form">Начать проект</MagneticButton>
      <a href="#top" className={s.toTop}>Наверх ↑</a>
    </section>
  );
}
