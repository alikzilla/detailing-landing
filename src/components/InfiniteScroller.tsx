import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLenis } from '../hooks/useLenis';
import s from './InfiniteScroller.module.css';

type Props<T> = {
  items: T[];
  /** short names for the side navigation */
  titles: string[];
  /** page name shown next to the counter */
  label: string;
  /** used for anchors: `${idPrefix}-1` … so `/services#s-3` opens the third item */
  idPrefix: string;
  renderPanel: (item: T, index: number) => ReactNode;
};

/**
 * Full-screen panels on a looping page (Lenis `infinite`). After the last panel the first one is
 * rendered again as a clone, so when Lenis wraps the scroll position from the end back to 0 the
 * screen looks identical and the loop is seamless in both directions.
 *
 * Inside a panel, mark the element to drift with `data-parallax` and the text block with `data-reveal`.
 */
export default function InfiniteScroller<T>({ items, titles, label, idPrefix, renderPanel }: Props<T>) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [index, setIndex] = useState(0);
  const n = items.length;

  // scroll-linked motion for every panel (clone included, so it matches panel 1 exactly)
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-panel]', root.current).forEach((panel) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
        const media = panel.querySelector('[data-parallax]');
        const text = panel.querySelector('[data-reveal]');
        if (media) tl.fromTo(media, { yPercent: -12, scale: 1.08 }, { yPercent: 12, scale: 1.08, ease: 'none', duration: 1 }, 0);
        if (text) {
          tl.fromTo(text, { y: 140, opacity: 0 }, { y: 0, opacity: 1, ease: 'power1.out', duration: 0.38 }, 0)
            .to(text, { y: -140, opacity: 0, ease: 'power1.in', duration: 0.38 }, 0.62);
        }
      });
    },
    { scope: root, dependencies: [n] },
  );

  useEffect(() => {
    if (!lenis) return;
    const vh = () => window.innerHeight;

    // open the item from the URL hash (e.g. #s-3) right away
    const fromHash = Number(window.location.hash.replace(`#${idPrefix}-`, ''));
    if (fromHash >= 1 && fromHash <= n) lenis.scrollTo((fromHash - 1) * vh(), { immediate: true, force: true });
    else lenis.scrollTo(0, { immediate: true, force: true });

    // current item + gentle snap to the nearest panel once scrolling settles
    let timer: ReturnType<typeof setTimeout>;
    const off = lenis.on('scroll', () => {
      const wrapped = ((lenis.scroll % (n * vh())) + n * vh()) % (n * vh());
      setIndex(Math.round(wrapped / vh()) % n);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (Math.abs(lenis.velocity) > 0.05 || lenis.isStopped) return;
        const cur = lenis.animatedScroll;
        const target = Math.round(cur / vh()) * vh();
        if (Math.abs(target - cur) > 2) lenis.scrollTo(target, { duration: 0.8 });
      }, 160);
    });
    return () => {
      clearTimeout(timer);
      off();
    };
  }, [lenis, n, idPrefix]);

  // jump to item i, taking the shortest way around the loop
  const goTo = (i: number) => {
    if (!lenis) return;
    const vh = window.innerHeight;
    const cur = lenis.animatedScroll;
    let target = Math.floor(cur / (n * vh)) * n * vh + i * vh;
    if (target - cur > (n * vh) / 2) target -= n * vh;
    if (cur - target > (n * vh) / 2) target += n * vh;
    lenis.scrollTo(target, { duration: 1.4 });
  };

  const pad = (i: number) => String(i).padStart(2, '0');

  return (
    <div className={s.scroller} ref={root}>
      {items.map((item, i) => (
        <div key={i} id={`${idPrefix}-${i + 1}`} className={s.panel} data-panel>
          {renderPanel(item, i)}
        </div>
      ))}
      {/* seamless loop: a copy of the first panel sits after the last one */}
      <div className={s.panel} data-panel aria-hidden="true" ref={(el) => el?.setAttribute("inert", "")}>
        {renderPanel(items[0], 0)}
      </div>

      <div className={s.hud}>
        <div className={s.counter}>
          <span>{label}</span>
          <span className={s.digits}>
            <span className={s.digitsStack} style={{ transform: `translateY(${-index * 28}px)` }}>
              {items.map((_, i) => <span key={i}>{pad(i + 1)}</span>)}
            </span>
          </span>
          <span className={s.total}>/ {pad(n)}</span>
        </div>
        <span className={s.hint}>Листайте — список бесконечный</span>
      </div>

      <nav className={s.nav} aria-label={label}>
        {titles.map((t, i) => (
          <button key={t} className={i === index ? s.active : undefined} onClick={() => goTo(i)} aria-current={i === index}>
            {t} <i />
          </button>
        ))}
      </nav>
    </div>
  );
}
