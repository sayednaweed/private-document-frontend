import { BrowserRouter, Route, Routes } from "react-router";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import UserPage from "@/views/pages/auth/general/users/user-page";
import ProfilePage from "@/views/pages/auth/general/profile/profile-page";
import LogsPage from "@/views/pages/auth/super/logs/logs-page";
import ErrorPage from "@/views/pages/error/error-page";
import SuperDashboardPage from "@/views/pages/auth/super/dashboard/super-dashboard-page";
import SuperSettingsPage from "@/views/pages/auth/general/settings/super-settings-page";
import LoginPage from "@/views/pages/guest/login-page";
import SuperAuditPage from "@/views/pages/auth/super/audit/super-audit-page";
import SuperUserEditPage from "@/views/pages/auth/general/users/edit/super-user-edit-page";
import { User, UserPermission } from "@/database/tables";
import ProtectedRoute from "@/routes/protected-route";
import Unauthorized from "@/views/pages/error/unauthorized";
import DocumentsPage from "@/views/pages/auth/general/document/document-page";
import SuperReportsPage from "@/views/pages/auth/general/reports/super-reports-page";
import GuestLayout from "@/views/layout/guest-layout";
import DocumentEditPage from "@/views/pages/auth/general/document/edit/document-edit-page";
import AuthLayout from "@/views/layout/auth-layout";
import UserDashboardPage from "@/views/pages/auth/user/dashboard/user-dashboard-page";
import AdminDashboardPage from "@/views/pages/auth/admin/dashboard/admin-dashboard-page";

export const getSuperRouter = (user: User) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<SuperDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
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
          <Route
            path="documents/:id"
            element={
              <ProtectedRoute
                element={<DocumentEditPage />}
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

        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<AdminDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
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
            path="documents"
            element={
              <ProtectedRoute
                element={<DocumentsPage />}
                routeName="documents"
                permissions={permissions}
              />
            }
          />
          <Route
            path="documents/:id"
            element={
              <ProtectedRoute
                element={<DocumentEditPage />}
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

        {/* User Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<UserDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
              />
            }
          />
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
            path="documents"
            element={
              <ProtectedRoute
                element={<DocumentsPage />}
                routeName="documents"
                permissions={permissions}
              />
            }
          />
          <Route
            path="documents/:id"
            element={
              <ProtectedRoute
                element={<DocumentEditPage />}
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
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};
