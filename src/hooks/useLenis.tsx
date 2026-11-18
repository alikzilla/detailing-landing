import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LenisContext = createContext<Lenis | null>(null);

type Props = { children: ReactNode; /** loop the page: scrolling past the end wraps to the start */ infinite?: boolean };

/**
 * One Lenis smooth-scroll instance, driven from GSAP's ticker so ScrollTrigger stays in sync.
 * It is rebuilt when `infinite` changes (landing page = normal scroll, catalogue pages = looping).
 */
export function LenisProvider({ children, infinite = false }: Props) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite,
      syncTouch: infinite, // Lenis needs to own touch scrolling for the loop to work on phones
    });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [infinite]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);
