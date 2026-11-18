import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import MagneticButton from '../components/MagneticButton';
import { services } from '../data/content';
import s from './Services.module.css';

/** Each service: sticky text on the left, image on the right opening from a small frame. */
export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(`.${s.svc}`, root.current).forEach((svc) => {
        const img = svc.querySelector(`.${s.img}`);
        gsap
          .timeline({ scrollTrigger: { trigger: svc, start: 'top 85%', end: 'top 10%', scrub: 1 } })
          .to(img, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
          .to(img?.querySelector('[data-ph-inner]') ?? null, { scale: 1, ease: 'none' }, 0);
        gsap.from(svc.querySelectorAll(`.${s.text} > *`), {
          opacity: 0, y: 30, stagger: 0.08, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: svc, start: 'top 60%' },
        });
      });
    },
    { scope: root },
  );

  const pad = (i: number) => String(i).padStart(2, '0');

  return (
    <section className={s.services} id="services" ref={root}>
      {services.map((x, i) => (
        <article className={s.svc} key={x.title}>
          <div className={s.text}>
            <span className={s.num}>{pad(i + 1)} / {pad(services.length)}</span>
            <p className="eyebrow">Service</p>
            <h3>{x.title}</h3>
            <p>{x.text}</p>
            <MagneticButton href="#contact">Enquire</MagneticButton>
          </div>
          <div className={s.media}>
            <Placeholder className={s.img} n={x.img.n} text={x.img.text} style={x.tone ? { background: x.tone } : undefined} />
          </div>
        </article>
      ))}
    </section>
  );
}
