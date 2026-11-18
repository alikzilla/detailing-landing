import { useEffect, useRef, useState, type FormEvent } from 'react';
import { contact, form } from '../data/content';
import s from './ContactForm.module.css';

type Props = { open: boolean; service?: string; onClose: () => void };

/**
 * Slide-in project enquiry form. Opened by any link to "#form" (see App).
 * There is no backend yet: submit only simulates sending and shows the thank-you state.
 */
export default function ContactForm({ open, service, onClose }: Props) {
  const firstField = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // preselect the service of the button that opened the form; reset after a sent form
  useEffect(() => {
    if (!open) return;
    if (status === 'sent') setStatus('idle');
    if (service) setSelected((cur) => (cur.includes(service) ? cur : [...cur, service]));
    const t = setTimeout(() => firstField.current?.focus({ preventScroll: true }), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, service]);

  // keep the closed panel out of tab order and screen readers (React 18 has no `inert` prop yet)
  useEffect(() => {
    panel.current?.toggleAttribute('inert', !open);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toggle = (name: string) =>
    setSelected((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl));
    setStatus('sending');
    // TODO: send `{ ...data, services: selected }` to your backend, Telegram bot or CRM here
    await new Promise((r) => setTimeout(r, 900));
    console.info('Заявка (демо, никуда не отправлена):', { ...data, services: selected });
    formEl.reset();
    setSelected([]);
    setStatus('sent');
  };

  return (
    <div className={open ? s.open : undefined} aria-hidden={!open}>
      <div className={s.overlay} onClick={onClose} />
      <aside className={s.panel} role="dialog" aria-modal="true" aria-labelledby="form-title" data-lenis-prevent ref={panel}>
        <div className={s.top}>
          <span className="eyebrow">Заявка</span>
          <button className={s.close} onClick={onClose}>Закрыть <i /></button>
        </div>

        {status === 'sent' ? (
          <div className={s.success} role="status">
            <h3>{form.successTitle}</h3>
            <p>{form.successText}</p>
            <p>Если срочно — пишите на <a href={`mailto:${contact.email}`}>{contact.email}</a> или звоните {contact.phone}.</p>
            <button className={s.submit} onClick={onClose}>Вернуться на сайт</button>
          </div>
        ) : (
          <>
            <h2 className={s.title} id="form-title">
              {form.title.split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}
            </h2>
            <p className={s.intro}>{form.intro}</p>

            <form className={s.form} onSubmit={onSubmit}>
              <div className={s.row}>
                <label className={s.field}>
                  <span className={s.label}>Имя <em>*</em></span>
                  <input ref={firstField} className={s.input} name="name" required autoComplete="name" placeholder="Как к вам обращаться" />
                </label>
                <label className={s.field}>
                  <span className={s.label}>Телефон <em>*</em></span>
                  <input className={s.input} name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9+()\-\s]{7,}" placeholder="+7 ___ ___ __ __" />
                </label>
              </div>

              <div className={s.row}>
                <label className={s.field}>
                  <span className={s.label}>Автомобиль</span>
                  <input className={s.input} name="car" placeholder="Марка, модель, год" />
                </label>
                <label className={s.field}>
                  <span className={s.label}>Бюджет</span>
                  <select className={s.input} name="budget" defaultValue="">
                    <option value="" disabled>Выберите</option>
                    {form.budgets.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </label>
              </div>

              <fieldset className={s.field} style={{ border: 0 }}>
                <legend className={s.label} style={{ marginBottom: 12 }}>Что нужно сделать</legend>
                <div className={s.chips}>
                  {form.services.map((name) => (
                    <label key={name} className={s.chip}>
                      <input type="checkbox" checked={selected.includes(name)} onChange={() => toggle(name)} />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className={s.field}>
                <span className={s.label}>Комментарий</span>
                <textarea className={s.input} name="message" rows={3} placeholder="Расскажите, что хотите получить в итоге" />
              </label>

              <p className={s.consent}>{form.consent}</p>
              <button className={s.submit} type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
