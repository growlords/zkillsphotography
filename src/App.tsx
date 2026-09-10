import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SiteContentProvider } from './context/SiteContentContext';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { ToastProvider } from './admin/components/AdminToast';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLayout } from './admin/components/AdminLayout';

// Public Experience
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';

// Admin Pages
import { LoginPage } from './admin/pages/LoginPage';
import { DashboardOverview } from './admin/pages/DashboardOverview';
import { WebsiteContentEditor } from './admin/pages/WebsiteContentEditor';
import { HeroEditor } from './admin/pages/HeroEditor';
import { PortfolioManager } from './admin/pages/PortfolioManager';
import { ServicesEditor } from './admin/pages/ServicesEditor';
import { AboutEditor } from './admin/pages/AboutEditor';
import { ProcessEditor } from './admin/pages/ProcessEditor';
import { TestimonialsEditor } from './admin/pages/TestimonialsEditor';
import { ContactSettings } from './admin/pages/ContactSettings';
import { SocialSettings } from './admin/pages/SocialSettings';
import { SeoSettings } from './admin/pages/SeoSettings';
import { MediaLibrary } from './admin/pages/MediaLibrary';
import { AdminSettings } from './admin/pages/AdminSettings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SiteContentProvider>
        <AdminAuthProvider>
          <ToastProvider>
            <Routes>
              {/* Admin Login Route */}
              <Route path="/admin/login" element={<LoginPage />} />

              {/* Protected Admin Console Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="content" element={<WebsiteContentEditor />} />
                <Route path="hero" element={<HeroEditor />} />
                <Route path="portfolio" element={<PortfolioManager />} />
                <Route path="services" element={<ServicesEditor />} />
                <Route path="about" element={<AboutEditor />} />
                <Route path="process" element={<ProcessEditor />} />
                <Route path="testimonials" element={<TestimonialsEditor />} />
                <Route path="contact" element={<ContactSettings />} />
                <Route path="social" element={<SocialSettings />} />
                <Route path="seo" element={<SeoSettings />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>

              {/* Public Portfolio Website */}
              <Route path="/*" element={<PublicPortfolioPage />} />
            </Routes>
          </ToastProvider>
        </AdminAuthProvider>
      </SiteContentProvider>
    </BrowserRouter>
  );
};

export default App;
