import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Placeholder from '../components/Placeholder';
import MagneticButton from '../components/MagneticButton';
import { pillars } from '../data/content';
import s from './Pillars.module.css';

/** Pinned 3-step slider: image wipes, blurred background crossfades, title/text swap and a rolling counter. */
export default function Pillars() {
  const root = useRef<HTMLElement>(null);
  const n = pillars.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const media = q(`.${s.slide}`);
      const bgs = q(`.${s.bgImg}`);
      const titles = q(`.${s.titles} h3`);
      const texts = q(`.${s.texts} p`);

      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: `+=${n * 100}%`, scrub: 1, pin: true } });
      for (let i = 1; i < n; i++) {
        const at = i - 0.5;
        tl.to(media[i], { clipPath: 'inset(0% 0 0 0)', duration: 0.6, ease: 'power2.inOut' }, at)
          .to(bgs[i], { opacity: 1, duration: 0.6 }, at)
          .to(titles[i - 1], { opacity: 0, filter: 'blur(12px)', y: -20, duration: 0.3 }, at)
          .fromTo(titles[i], { y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.3 }, at + 0.3)
          .to(texts[i - 1], { opacity: 0, duration: 0.25 }, at)
          .to(texts[i], { opacity: 1, duration: 0.25 }, at + 0.35)
          .to(`.${s.cur} span`, { yPercent: -100 * i, duration: 0.4 }, at + 0.1);
      }
      tl.to(`.${s.progressFill}`, { scaleX: 1, ease: 'none', duration: n }, 0);
    },
    { scope: root },
  );

  const pad = (i: number) => String(i).padStart(2, '0');
  const tone = (t?: string) => (t ? { background: t } : undefined);

  return (
    <section className={s.pillars} id="pillars" ref={root}>
      <div className={s.bg}>
        {pillars.map((p) => <Placeholder key={p.title} className={s.bgImg} style={tone(p.tone)} />)}
      </div>
      <div className={s.inner}>
        <div className={s.media}>
          {pillars.map((p) => (
            <Placeholder key={p.title} className={s.slide} tag n={p.img.n} text={p.img.text} style={tone(p.tone)} />
          ))}
        </div>
        <div>
          <div className={s.count}>
            <span className={s.cur}>{pillars.map((_, i) => <span key={i}>{pad(i + 1)}</span>)}</span>
            <span className={s.total}>/ {pad(n)}</span>
          </div>
          <div className={s.titles}>{pillars.map((p) => <h3 key={p.title}>{p.title}</h3>)}</div>
          <div className={s.texts}>{pillars.map((p) => <p key={p.title}>{p.text}</p>)}</div>
          <MagneticButton href="#form">Начать проект</MagneticButton>
        </div>
      </div>
      <div className={s.progress}><span className={s.progressFill} /></div>
    </section>
  );
}
