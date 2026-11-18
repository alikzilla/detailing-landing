import { forwardRef, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import s from './PageCurtain.module.css';

export type CurtainHandle = {
  /** cover the screen, then call `onCovered` (navigate there) */
  cover: (label: string, onCovered: () => void) => void;
  /** reveal the new page */
  reveal: () => void;
};

/** Black panel that wipes up over the page between routes, showing the destination name. */
const PageCurtain = forwardRef<CurtainHandle>(function PageCurtain(_, ref) {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    cover(text, onCovered) {
      if (label.current) label.current.textContent = text;
      gsap
        .timeline()
        .set(root.current, { pointerEvents: 'auto' })
        .fromTo(root.current, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'expo.inOut' })
        .fromTo(label.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, '-=.25')
        .add(onCovered, '+=.1');
    },
    reveal() {
      gsap
        .timeline({ delay: 0.15 })
        .to(label.current, { opacity: 0, y: -20, duration: 0.3 })
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' }, '-=.1')
        .set(root.current, { pointerEvents: 'none' });
    },
  }));

  return (
    <div className={s.curtain} ref={root} aria-hidden="true">
      <span className={s.label} ref={label} />
    </div>
  );
});

export default PageCurtain;
