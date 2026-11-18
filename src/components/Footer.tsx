import { contact, socials } from '../data/content';
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.grid}>
        <div>
          <h4>Studio</h4>
          <p className={s.address}>{contact.address[0]}<br />{contact.address[1]}</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="#pillars">Approach</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#builds">Builds</a></li>
          </ul>
        </div>
        <div>
          <h4>Social</h4>
          <ul>{socials.map((x) => <li key={x.short}><a href={x.href}>{x.label}</a></li>)}</ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li><a href="#">{contact.phone}</a></li>
          </ul>
        </div>
      </div>
      <div className={s.brand}>Vanta Atelier</div>
      <div className={s.bottom}><span>© 2026 Vanta Atelier: practice project</span><span>Privacy · Cookies</span></div>
    </footer>
  );
}
