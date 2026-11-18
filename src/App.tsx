import { useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LenisProvider, useLenis } from './hooks/useLenis';
import Loader from './components/Loader';
import Header from './components/Header';
import Menu from './components/Menu';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import ContactForm from './components/ContactForm';
import PageCurtain, { type CurtainHandle } from './components/PageCurtain';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';

/** Pages whose scroll loops forever. */
const LOOPING = ['/services', '/projects'];
const PAGE_NAMES: Record<string, string> = { '/': 'Vanta Atelier', '/services': 'Услуги', '/projects': 'Проекты' };

/** Where to scroll for an in-page link. Pinned sections are wrapped in a ScrollTrigger
 *  .pin-spacer whose position is the real one; the pinned element itself may be fixed/offset. */
function scrollTarget(hash: string): HTMLElement | number | null {
  if (!hash || hash === '#top') return 0;
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return null;
  const parent = el.parentElement;
  return parent?.classList.contains('pin-spacer') ? parent : el;
}

function Site({ entered, onEnter }: { entered: boolean; onEnter: () => void }) {
  const lenis = useLenis();
  const location = useLocation();
  const navigate = useNavigate();
  const curtain = useRef<CurtainHandle>(null);
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;
  const navigating = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formService, setFormService] = useState<string>();

  // lock scroll until the loader is dismissed, and while the menu or form is open
  useEffect(() => {
    if (!lenis) return;
    const locked = !entered || menuOpen || formOpen;
    document.body.classList.toggle('is-locked', locked);
    locked ? lenis.stop() : lenis.start();
  }, [lenis, entered, menuOpen, formOpen]);

  // re-measure scroll positions once web fonts have loaded
  useEffect(() => {
    document.fonts.ready.then(() => {
      ScrollTrigger.clearScrollMemory('manual');
      ScrollTrigger.refresh();
    });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.globalTimeline.timeScale(20);
  }, []);

  // after every route change: measure the new page, honour a #hash on the landing page, lift the curtain
  useEffect(() => {
    if (!lenis) return;
    const isLooping = LOOPING.includes(location.pathname);
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (!isLooping) {
        const target = scrollTarget(location.hash);
        lenis.scrollTo(target ?? 0, { immediate: true, force: true });
        ScrollTrigger.update();
      }
      if (navigating.current) {
        navigating.current = false;
        curtain.current?.reveal();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [lenis, location.pathname, location.hash]);

  // one click handler for every internal link:
  //   "#form"           → open the enquiry form
  //   "#section"        → smooth-scroll on this page
  //   "/page" "/#hash"  → page transition (or smooth-scroll if already on that page)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href]');
      const href = a?.getAttribute('href');
      if (!a || !href || !(href.startsWith('#') || href.startsWith('/'))) return;
      e.preventDefault();
      setMenuOpen(false);

      if (href === '#form') {
        setFormService(a.dataset.service);
        setFormOpen(true);
        return;
      }

      const [path, hash = ''] = href.startsWith('#') ? [pathRef.current, href.slice(1)] : href.split('#');
      const fullHash = hash ? `#${hash}` : '';

      if (path === pathRef.current) {
        const target = scrollTarget(fullHash);
        if (target !== null) requestAnimationFrame(() => lenis?.scrollTo(target, { duration: 1.6 }));
        return;
      }

      navigating.current = true;
      curtain.current?.cover(PAGE_NAMES[path] ?? '', () => navigate(path + fullHash));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis, navigate]);

  const closeForm = useCallback(() => setFormOpen(false), []);

  return (
    <>
      {!entered && <Loader onEnter={onEnter} />}
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} />
      <Menu open={menuOpen} />
      <Routes>
        <Route path="/" element={<Home entered={entered} />} />
        <Route path="/services" element={<ServicesPage key={location.key} />} />
        <Route path="/projects" element={<ProjectsPage key={location.key} />} />
        <Route path="*" element={<Home entered={entered} />} />
      </Routes>
      <ContactForm open={formOpen} service={formService} onClose={closeForm} />
      <ScrollProgress />
      <Cursor />
      <PageCurtain ref={curtain} />
    </>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const [entered, setEntered] = useState(false);
  const enter = useCallback(() => setEntered(true), []);

  return (
    <LenisProvider infinite={LOOPING.includes(pathname)}>
      <Site entered={entered} onEnter={enter} />
    </LenisProvider>
  );
}
