import { lazy, Suspense } from 'react';
import { InnerCompassWorkshopPage } from './pages/InnerCompassWorkshopPage';
import { PesanCintaHomePage } from './pages/PesanCintaHomePage';

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage })));
const RegistrationDetailPage = lazy(() => import('./pages/admin/RegistrationDetailPage').then((module) => ({ default: module.RegistrationDetailPage })));
const RegistrationsPage = lazy(() => import('./pages/admin/RegistrationsPage').then((module) => ({ default: module.RegistrationsPage })));
const WorkshopEditorPage = lazy(() => import('./pages/admin/WorkshopEditorPage').then((module) => ({ default: module.WorkshopEditorPage })));
const WorkshopsPage = lazy(() => import('./pages/admin/WorkshopsPage').then((module) => ({ default: module.WorkshopsPage })));
const WorkshopPublicPage = lazy(() => import('./pages/WorkshopPublicPage').then((module) => ({ default: module.WorkshopPublicPage })));

function RouteLoader() {
  return <main className="grid min-h-svh place-items-center bg-page-deep text-primary">Loading...</main>;
}

export default function App() {
  if (window.location.pathname === '/admin/login') {
    return (
      <Suspense fallback={<RouteLoader />}>
        <AdminLoginPage />
      </Suspense>
    );
  }

  if (window.location.pathname.startsWith('/admin/registrations/')) {
    const registrationId = window.location.pathname.replace('/admin/registrations/', '');
    return (
      <Suspense fallback={<RouteLoader />}>
        <AdminDashboardPage page={<RegistrationDetailPage registrationId={registrationId} />} />
      </Suspense>
    );
  }

  if (window.location.pathname === '/admin/registrations') {
    return (
      <Suspense fallback={<RouteLoader />}>
        <AdminDashboardPage page={<RegistrationsPage />} />
      </Suspense>
    );
  }

  if (window.location.pathname === '/admin/workshops/new') {
    return (
      <Suspense fallback={<RouteLoader />}>
        <AdminDashboardPage page={<WorkshopEditorPage />} />
      </Suspense>
    );
  }

  if (window.location.pathname.startsWith('/admin/workshops/')) {
    const workshopId = window.location.pathname.replace('/admin/workshops/', '');
    return (
      <Suspense fallback={<RouteLoader />}>
        <AdminDashboardPage page={<WorkshopEditorPage workshopId={workshopId} />} />
      </Suspense>
    );
  }

  if (window.location.pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<RouteLoader />}>
        <AdminDashboardPage page={<WorkshopsPage />} />
      </Suspense>
    );
  }

  if (window.location.pathname === '/the-inner-compass-workshop') {
    return <InnerCompassWorkshopPage />;
  }

  if (window.location.pathname.startsWith('/workshops/')) {
    const slug = window.location.pathname.replace('/workshops/', '').replace(/\/$/, '');
    return (
      <Suspense fallback={<RouteLoader />}>
        <WorkshopPublicPage slug={slug} />
      </Suspense>
    );
  }

  return <PesanCintaHomePage />;
}
