import { InnerCompassWorkshopPage } from './pages/InnerCompassWorkshopPage';
import { PesanCintaHomePage } from './pages/PesanCintaHomePage';

export default function App() {
  if (window.location.pathname === '/the-inner-compass-workshop') {
    return <InnerCompassWorkshopPage />;
  }

  return <PesanCintaHomePage />;
}
