import { BrowserRouter, Route, Routes } from "react-router";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import AdminLayout from "@/views/layout/admin-layout";
import AdminDashboardPage from "@/views/pages/auth/admin/dashboard/admin-dashboard-page";
import UserPage from "@/views/pages/auth/general/users/user-page";
import ProfilePage from "@/views/pages/auth/general/profile/profile-page";
import LogsPage from "@/views/pages/auth/super/logs/logs-page";
import ErrorPage from "@/views/pages/error/error-page";
import SuperLayout from "@/views/layout/super-layout";
import SuperDashboardPage from "@/views/pages/auth/super/dashboard/super-dashboard-page";
import SuperSettingsPage from "@/views/pages/auth/general/settings/super-settings-page";
import LoginPage from "@/views/pages/guest/login-page";
import ForgotPasswordPage from "@/views/pages/guest/password/forgot-password-page";
import MainPage from "@/views/site/main-page";
import HomePage from "@/views/site/home/home-page";
import AboutPage from "@/views/site/about/about-page";
import ContactPage from "@/views/site/contact/contact-page";
import SiteLayout from "@/views/layout/site-layout";
import SuperAuditPage from "@/views/pages/auth/super/audit/super-audit-page";
import SuperUserEditPage from "@/views/pages/auth/general/users/edit/super-user-edit-page";
import { User, UserPermission } from "@/database/tables";
import ProtectedRoute from "@/routes/protected-route";
import Unauthorized from "@/views/pages/error/unauthorized";
import DocumentsPage from "@/views/pages/auth/general/document/document-page";
import SuperReportsPage from "@/views/pages/auth/general/reports/super-reports-page";
import UserDashboardPage from "@/views/pages/auth/user/dashboard/user-dashboard-page";
import GuestLayout from "@/views/layout/guest-layout";

export const getSuperRouter = (user: User) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>

        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SuperLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<SuperDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<UserPage />}
                routeName="users"
                permissions={permissions}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute
                element={<SuperUserEditPage />}
                routeName="users"
                permissions={permissions}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<SuperReportsPage />}
                routeName="reports"
                permissions={permissions}
              />
            }
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SuperSettingsPage />}
                routeName="settings"
                permissions={permissions}
              />
            }
          />
          <Route
            path="audit"
            element={
              <ProtectedRoute
                element={<SuperAuditPage />}
                routeName="audit"
                permissions={permissions}
              />
            }
          />
          <Route
            path="logs"
            element={
              <ProtectedRoute
                element={<LogsPage />}
                routeName="logs"
                permissions={permissions}
              />
            }
          />
          <Route
            path="documents"
            element={
              <ProtectedRoute
                element={<DocumentsPage />}
                routeName="documents"
                permissions={permissions}
              />
            }
          />
        </Route>

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getAdminRouter = (user: User) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>

        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AdminLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<AdminDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<UserPage />}
                routeName="users"
                permissions={permissions}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute
                element={<SuperUserEditPage />}
                routeName="users"
                permissions={permissions}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<SuperReportsPage />}
                routeName="reports"
                permissions={permissions}
              />
            }
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SuperSettingsPage />}
                routeName="settings"
                permissions={permissions}
              />
            }
          />
          <Route
            path="audit"
            element={
              <ProtectedRoute
                element={<SuperAuditPage />}
                routeName="audit"
                permissions={permissions}
              />
            }
          />
          <Route
            path="logs"
            element={
              <ProtectedRoute
                element={<LogsPage />}
                routeName="logs"
                permissions={permissions}
              />
            }
          />
          <Route
            path="documents"
            element={
              <ProtectedRoute
                element={<DocumentsPage />}
                routeName="documents"
                permissions={permissions}
              />
            }
          />
        </Route>

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export const getUserRouter = (user: User) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>

        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SuperLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<UserDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<SuperReportsPage />}
                routeName="reports"
                permissions={permissions}
              />
            }
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SuperSettingsPage />}
                routeName="settings"
                permissions={permissions}
              />
            }
          />
          <Route
            path="audit"
            element={
              <ProtectedRoute
                element={<SuperAuditPage />}
                routeName="audit"
                permissions={permissions}
              />
            }
          />
          <Route
            path="logs"
            element={
              <ProtectedRoute
                element={<LogsPage />}
                routeName="logs"
                permissions={permissions}
              />
            }
          />
          <Route
            path="documents"
            element={
              <ProtectedRoute
                element={<DocumentsPage />}
                routeName="documents"
                permissions={permissions}
              />
            }
          />
        </Route>

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export const getGuestRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <GuestLayout />
            </I18nextProvider>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forget-password" element={<ForgotPasswordPage />} />
        </Route>
        {/* Site Routes */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <SiteLayout />
            </I18nextProvider>
          }
        >
          {/* These routes will be passed as children */}
          {site}
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const site = (
  <Route path="/" element={<MainPage />}>
    <Route index element={<HomePage />} />
    {/* Default route (equivalent to `/`) */}
    <Route path="about" element={<AboutPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="*" element={<HomePage />} />
    {/* Fallback for unknown routes */}
  </Route>
);
