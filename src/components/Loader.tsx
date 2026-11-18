import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Logo from './Logo';
import SplitWords from './SplitWords';
import { loaderLine } from '../data/content';
import s from './Loader.module.css';

/** Intro screen: progress bar, words sharpening from blur, then Enter / Skip. Wipes up on exit. */
export default function Loader({ onEnter }: { onEnter: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const words = `.${s.line} [data-word]`;

  useGSAP(
    () => {
      gsap
        .timeline()
        .to(`.${s.barFill}`, { scaleX: 1, duration: 2.2, ease: 'power2.inOut' })
        .to(words, { opacity: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.8, ease: 'power2.out' }, 0.2)
        .to(`.${s.actions}`, { opacity: 1, pointerEvents: 'auto', duration: 0.6 }, '-=.2')
        .to(`.${s.bar}`, { opacity: 0, duration: 0.4 }, '<');
    },
    { scope: root },
  );

  const { contextSafe } = useGSAP({ scope: root });
  const exit = contextSafe(() => {
    gsap
      .timeline()
      .to(words, { opacity: 0, filter: 'blur(10px)', stagger: 0.02, duration: 0.4 })
      .to(`.${s.actions}`, { opacity: 0, pointerEvents: 'none', duration: 0.3 }, 0)
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 0.3)
      .add(onEnter, '-=.3');
  });

  return (
    <div className={s.loader} ref={root}>
      <div className={s.mark}><Logo width={34} /></div>
      <p className={s.line}><SplitWords text={loaderLine} /></p>
      <div className={s.actions}>
        <button onClick={exit}>Enter</button>
        <button className={s.ghost} onClick={exit}>Skip intro</button>
      </div>
      <div className={s.bar}><span className={s.barFill} /></div>
    </div>
  );
}
