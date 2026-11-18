import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './styles/global.css';
import App from './App';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Always start at the top: the loader and hero entrance assume scroll position 0.
// ScrollTrigger manages history.scrollRestoration itself, so set it through its API.
ScrollTrigger.clearScrollMemory('manual');
window.scrollTo(0, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
