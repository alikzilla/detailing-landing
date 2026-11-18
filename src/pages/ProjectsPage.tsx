import InfiniteScroller from '../components/InfiniteScroller';
import Placeholder from '../components/Placeholder';
import MagneticButton from '../components/MagneticButton';
import { projects, type Project } from '../data/content';
import s from './ProjectsPage.module.css';

function ProjectPanel({ item, index }: { item: Project; index: number }) {
  return (
    <article className={s.panel}>
      <div className={s.bg} data-parallax>
        <Placeholder className={s.img} tag n={item.img.n} text={item.img.text} style={item.tone ? { background: item.tone } : undefined} />
      </div>
      <div className={s.shade} />
      <div className={s.content} data-reveal>
        <div>
          <span className={s.num}>Проект {String(index + 1).padStart(2, '0')}</span>
          <h2 className={s.title}>{item.title}</h2>
          <dl className={s.facts}>
            <div><dt>Автомобиль</dt><dd>{item.car}</dd></div>
            <div><dt>Год</dt><dd>{item.year}</dd></div>
          </dl>
        </div>
        <div className={s.side}>
          <div className={s.tags}>{item.works.map((w) => <span key={w}>{w}</span>)}</div>
          <MagneticButton href="#form">Хочу так же</MagneticButton>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <InfiniteScroller
      items={projects}
      titles={projects.map((x) => x.title)}
      label="Проекты"
      idPrefix="p"
      renderPanel={(item, i) => <ProjectPanel item={item} index={i} />}
    />
  );
}
