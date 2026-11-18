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
        <h2 className={s.heading}><SplitWords text="Машина должна ощущаться законченной ещё до запуска двигателя. Каждый шов, грань и поверхность на своём месте." /></h2>
        <p className={s.body}>Стайлинг, интерьер, свет и защита планируются вместе, чтобы каждое решение усиливало остальные, а не спорило с ними.</p>
        <MagneticButton href="#services">Смотреть услуги</MagneticButton>
      </div>
      <div className={s.imgWrap}>
        <Placeholder className={s.img} tag n="08" text="Кованый диск и карбоновый тормоз, нижний ракурс, вертикальный кадр" />
      </div>
    </section>
  );
}
