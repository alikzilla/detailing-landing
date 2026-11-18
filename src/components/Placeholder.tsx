import type { CSSProperties } from 'react';
import s from './Placeholder.module.css';

type Props = {
  n?: string;
  text?: string;
  tag?: boolean;
  logo?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Gray stand-in for a photo: a number plus a note describing the image that belongs here.
 * Parents size/position it through `className`; `data-ph-inner` / `data-ph-text` are stable hooks
 * other modules can target (CSS modules hash class names, data attributes stay as written).
 */
export default function Placeholder({ n, text, tag, logo, className, style }: Props) {
  const cls = [s.ph, logo && s.logo, className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      {tag && <span className={s.tag}>Image</span>}
      {(n || text) && (
        <div className={s.inner} data-ph-inner>
          {n && <span className={s.num}>{n}</span>}
          {text && <span className={s.text} data-ph-text>{text}</span>}
        </div>
      )}
    </div>
  );
}
