import { ContactFooter } from './components/ContactFooter';
import { EmpathySection } from './components/EmpathySection';
import { Hero } from './components/Hero';
import { PhotoProof } from './components/PhotoProof';
import { TrainerProfiles } from './components/TrainerProfiles';
import { WorkshopPillars } from './components/WorkshopPillars';

export default function App() {
  return (
    <main>
      <Hero />
      <EmpathySection />
      <WorkshopPillars />
      <PhotoProof />
      <TrainerProfiles />
      <ContactFooter />
    </main>
  );
}
