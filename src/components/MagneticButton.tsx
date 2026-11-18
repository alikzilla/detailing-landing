import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import s from './MagneticButton.module.css';

/** Outline button that leans toward the mouse and springs back on leave. */
type Props = { href: string; children: ReactNode; /** preselects a service when the button opens the form */ service?: string };

export default function MagneticButton({ href, children, service }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.3,
      y: (e.clientY - r.top - r.height / 2) * 0.4,
      duration: 0.4,
    });
  };
  const onLeave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.4)' });

  return (
    <a ref={ref} href={href} data-service={service} className={s.btn} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children} <i className={s.arrow} />
    </a>
  );
}
