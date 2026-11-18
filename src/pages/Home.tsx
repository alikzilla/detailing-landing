import Hero from '../sections/Hero';
import Intro from '../sections/Intro';
import Marques from '../sections/Marques';
import Pillars from '../sections/Pillars';
import Statement from '../sections/Statement';
import ServicesTeaser from '../sections/ServicesTeaser';
import ProjectsTeaser from '../sections/ProjectsTeaser';
import Cta from '../sections/Cta';

export default function Home({ entered }: { entered: boolean }) {
  return (
    <main>
      <Hero entered={entered} />
      <Intro />
      <Marques />
      <Pillars />
      <Statement />
      <ServicesTeaser />
      <ProjectsTeaser />
      <Cta />
    </main>
  );
}
