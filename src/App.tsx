import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { WorkshopEditorPage } from './pages/admin/WorkshopEditorPage';
import { WorkshopsPage } from './pages/admin/WorkshopsPage';
import { InnerCompassWorkshopPage } from './pages/InnerCompassWorkshopPage';
import { PesanCintaHomePage } from './pages/PesanCintaHomePage';
import { WorkshopPublicPage } from './pages/WorkshopPublicPage';

export default function App() {
  if (window.location.pathname === '/admin/login') {
    return <AdminLoginPage />;
  }

  if (window.location.pathname === '/admin/workshops/new') {
    return <AdminDashboardPage page={<WorkshopEditorPage />} />;
  }

  if (window.location.pathname.startsWith('/admin/workshops/')) {
    const workshopId = window.location.pathname.replace('/admin/workshops/', '');
    return <AdminDashboardPage page={<WorkshopEditorPage workshopId={workshopId} />} />;
  }

  if (window.location.pathname.startsWith('/admin')) {
    return <AdminDashboardPage page={<WorkshopsPage />} />;
  }

  if (window.location.pathname === '/the-inner-compass-workshop') {
    return <InnerCompassWorkshopPage />;
  }

  if (window.location.pathname.startsWith('/workshops/')) {
    const slug = window.location.pathname.replace('/workshops/', '').replace(/\/$/, '');
    return <WorkshopPublicPage slug={slug} />;
  }

  return <PesanCintaHomePage />;
}
