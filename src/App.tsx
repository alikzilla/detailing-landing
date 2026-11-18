import { useCallback, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LenisProvider, useLenis } from './hooks/useLenis';
import Loader from './components/Loader';
import Header from './components/Header';
import Menu from './components/Menu';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import Intro from './sections/Intro';
import Marques from './sections/Marques';
import Pillars from './sections/Pillars';
import Statement from './sections/Statement';
import Services from './sections/Services';
import TopDown from './sections/TopDown';
import Cta from './sections/Cta';

function Site() {
  const lenis = useLenis();
  const [entered, setEntered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // lock scroll until the loader is dismissed and while the menu is open
  useEffect(() => {
    if (!lenis) return;
    const locked = !entered || menuOpen;
    document.body.classList.toggle('is-locked', locked);
    locked ? lenis.stop() : lenis.start();
  }, [lenis, entered, menuOpen]);

  // re-measure scroll positions once web fonts have loaded
  useEffect(() => {
    document.fonts.ready.then(() => {
      ScrollTrigger.clearScrollMemory('manual');
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.globalTimeline.timeScale(20);
  }, []);

  // smooth-scroll every in-page "#" link through Lenis
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      const id = a?.getAttribute('href');
      if (!a || !id || id.length < 2) return;
      e.preventDefault();
      setMenuOpen(false);
      requestAnimationFrame(() => lenis?.scrollTo(id, { duration: 1.6 }));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis]);

  const enter = useCallback(() => setEntered(true), []);

  return (
    <>
      {!entered && <Loader onEnter={enter} />}
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} />
      <Menu open={menuOpen} />
      <main>
        <Hero entered={entered} />
        <Intro />
        <Marques />
        <Pillars />
        <Statement />
        <Services />
        <TopDown />
        <Cta />
      </main>
      <Footer />
      <ScrollProgress />
      <Cursor />
    </>
  );
}

export default function App() {
  return (
    <LenisProvider>
      <Site />
    </LenisProvider>
  );
}
