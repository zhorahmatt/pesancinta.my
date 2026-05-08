import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { InnerCompassWorkshopPage } from './pages/InnerCompassWorkshopPage';
import { PesanCintaHomePage } from './pages/PesanCintaHomePage';

export default function App() {
  if (window.location.pathname === '/admin/login') {
    return <AdminLoginPage />;
  }

  if (window.location.pathname.startsWith('/admin')) {
    return <AdminDashboardPage />;
  }

  if (window.location.pathname === '/the-inner-compass-workshop') {
    return <InnerCompassWorkshopPage />;
  }

  return <PesanCintaHomePage />;
}
