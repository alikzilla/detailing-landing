import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import MagneticButton from '../components/MagneticButton';
import { services } from '../data/content';
import s from './ServicesTeaser.module.css';

/** One-screen services overview: hover a row to swap the photo, click to open that service's page. */
export default function ServicesTeaser() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.from(`.${s.row}`, { opacity: 0, y: 24, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 65%' } });
      gsap.fromTo(`.${s.media}`, { clipPath: 'inset(18% 12% 18% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 10%', scrub: true } });
    },
    { scope: root },
  );

  return (
    <section className={s.section} id="services" ref={root}>
      <div>
        <p className="eyebrow">Услуги</p>
        <h2 className={s.heading}>Пять направлений,<br />один подход</h2>
        <ul className={s.list}>
          {services.map((x, i) => (
            <li key={x.title}>
              <a
                href={`/services#s-${i + 1}`}
                className={`${s.row} ${i === active ? s.active : ''}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className={s.idx}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.name}>{x.title}</span>
                <i className={s.arrow} />
              </a>
            </li>
          ))}
        </ul>
        <MagneticButton href="/services">Все услуги</MagneticButton>
      </div>
      <div className={s.media}>
        {services.map((x, i) => (
          <Placeholder key={x.title} className={`${s.img} ${i === active ? s.shown : ''}`} tag n={x.img.n} text={x.img.text} style={x.tone ? { background: x.tone } : undefined} />
        ))}
      </div>
    </section>
  );
}
