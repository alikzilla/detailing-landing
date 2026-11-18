import InfiniteScroller from '../components/InfiniteScroller';
import Placeholder from '../components/Placeholder';
import MagneticButton from '../components/MagneticButton';
import { services, type Service } from '../data/content';
import s from './ServicesPage.module.css';

function ServicePanel({ item, index }: { item: Service; index: number }) {
  return (
    <article className={s.panel}>
      <span className={s.bigNum} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div className={s.content} data-reveal>
        <p className="eyebrow">Услуга {String(index + 1).padStart(2, '0')}</p>
        <h2 className={s.title}>{item.title}</h2>
        <p className={s.text}>{item.text}</p>
        <ul className={s.list}>{item.includes.map((x) => <li key={x}>{x}</li>)}</ul>
        <dl className={s.meta}>
          <div><dt>Срок</dt><dd>{item.duration}</dd></div>
          <div><dt>Стоимость</dt><dd>{item.price}</dd></div>
        </dl>
        <MagneticButton href="#form" service={item.title}>Оставить заявку</MagneticButton>
      </div>
      <div className={s.media}>
        <div className={s.mediaInner} data-parallax>
          <Placeholder className={s.img} tag n={item.img.n} text={item.img.text} style={item.tone ? { background: item.tone } : undefined} />
        </div>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  return (
    <InfiniteScroller
      items={services}
      titles={services.map((x) => x.title)}
      label="Услуги"
      idPrefix="s"
      renderPanel={(item, i) => <ServicePanel item={item} index={i} />}
    />
  );
}
