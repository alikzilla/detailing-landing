import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import SplitWords from '../components/SplitWords';
import s from './Intro.module.css';

/** Pinned: words sharpen behind a small image, then the image grows to fill the screen. */
export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=150%', scrub: 1, pin: true } })
        .to(`.${s.words} [data-word]`, { filter: 'blur(0px)', opacity: 1, stagger: 0.1, duration: 0.5 }, 0)
        .to(`.${s.img}`, { width: '100vw', height: '100vh', duration: 1, ease: 'power2.inOut' }, 0.5)
        .to(`.${s.caption}`, { opacity: 0, duration: 0.2 }, 0.5);
    },
    { scope: root },
  );

  return (
    <section className={s.intro} ref={root}>
      <div className={s.words}>
        <span><SplitWords text="Тихие детали," /></span>
        <span><SplitWords text="громкий характер." /></span>
      </div>
      <Placeholder className={s.img} tag n="04" text="Макро: кожа с ручной строчкой цветной нитью, малая глубина резкости" />
      <p className={s.caption}>Каждый проект начинается с самой маленькой детали.</p>
    </section>
  );
}
