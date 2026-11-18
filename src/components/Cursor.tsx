import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import s from './Cursor.module.css';

/** Small blended dot that trails the mouse and grows over links and buttons. Hidden on touch screens via CSS. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [big, setBig] = useState(false);

  useEffect(() => {
    const x = gsap.quickTo(ref.current, 'x', { duration: 0.25, ease: 'power3' });
    const y = gsap.quickTo(ref.current, 'y', { duration: 0.25, ease: 'power3' });
    const move = (e: MouseEvent) => {
      setVisible(true);
      x(e.clientX);
      y(e.clientY);
      setBig(!!(e.target as Element).closest?.('a, button'));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const cls = [s.cursor, visible && s.on, big && s.big].filter(Boolean).join(' ');
  return <div ref={ref} className={cls} />;
}
