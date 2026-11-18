import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import s from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to(ref.current, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  });
  return <div ref={ref} className={s.progress} />;
}
