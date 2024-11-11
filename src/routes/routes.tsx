import { createBrowserRouter } from "react-router-dom";
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

export const getSuperRouter = (user: User) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return createBrowserRouter([
    unauthorized,
    {
      path: "/",
      element: (
        <I18nextProvider i18n={i18n}>
          <SiteLayout />
        </I18nextProvider>
      ),
      children: [siteRoutes],
    },
    {
      path: "/",
      element: (
        <I18nextProvider i18n={i18n}>
          <SuperLayout />
        </I18nextProvider>
      ),
      children: [
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute
              element={<SuperDashboardPage />}
              routeName="dashboard"
              permissions={permissions}
            />
          ),
        },

        {
          path: "/users",
          element: (
            <ProtectedRoute
              element={<UserPage />}
              routeName="users"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/users/:id",
          element: (
            <ProtectedRoute
              element={<SuperUserEditPage />}
              routeName="users"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/reports",
          element: (
            <ProtectedRoute
              element={<SuperReportsPage />}
              routeName="reports"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
        {
          path: "/settings",
          element: (
            <ProtectedRoute
              element={<SuperSettingsPage />}
              routeName="settings"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/audit",
          element: (
            <ProtectedRoute
              element={<SuperAuditPage />}
              routeName="audit"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/logs",
          element: (
            <ProtectedRoute
              element={<LogsPage />}
              routeName="logs"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/documents",
          element: (
            <ProtectedRoute
              element={<DocumentsPage />}
              routeName="documents"
              permissions={permissions}
            />
          ),
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);
};
export const getAdminRouter = (user: User) => {
  const permissions: Map<string, UserPermission> = user.permissions;

  return createBrowserRouter([
    unauthorized,
    {
      path: "/",
      element: (
        <I18nextProvider i18n={i18n}>
          <SiteLayout />
        </I18nextProvider>
      ),
      children: [siteRoutes],
    },
    {
      path: "/",
      element: (
        <I18nextProvider i18n={i18n}>
          <AdminLayout />
        </I18nextProvider>
      ),
      children: [
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute
              element={<AdminDashboardPage />}
              routeName="dashboard"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/users",
          element: (
            <ProtectedRoute
              element={<UserPage />}
              routeName="users"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/users/:id",
          element: (
            <ProtectedRoute
              element={<SuperUserEditPage />}
              routeName="users"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/reports",
          element: (
            <ProtectedRoute
              element={<SuperReportsPage />}
              routeName="reports"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/documents",
          element: (
            <ProtectedRoute
              element={<DocumentsPage />}
              routeName="documents"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);
};
export const getUserRouter = (user: User) => {
  const permissions: Map<string, UserPermission> = user.permissions;

  return createBrowserRouter([
    unauthorized,
    {
      path: "/",
      element: (
        <I18nextProvider i18n={i18n}>
          <SiteLayout />
        </I18nextProvider>
      ),
      children: [siteRoutes],
    },
    {
      path: "/",
      element: (
        <I18nextProvider i18n={i18n}>
          <AdminLayout />
        </I18nextProvider>
      ),
      children: [
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute
              element={<AdminDashboardPage />}
              routeName="dashboard"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/users",
          element: (
            <ProtectedRoute
              element={<UserPage />}
              routeName="users"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/users/:id",
          element: (
            <ProtectedRoute
              element={<SuperUserEditPage />}
              routeName="users"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/reports",
          element: (
            <ProtectedRoute
              element={<SuperReportsPage />}
              routeName="reports"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/documents",
          element: (
            <ProtectedRoute
              element={<DocumentsPage />}
              routeName="documents"
              permissions={permissions}
            />
          ),
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);
};

export const getGuestRouter = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: (
        <I18nextProvider i18n={i18n}>
          <SiteLayout />
        </I18nextProvider>
      ),
      children: [siteRoutes],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/forget-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);
};

const unauthorized = {
  path: "/unauthorized",
  element: <Unauthorized />,
};

const siteRoutes = {
  path: "/",
  element: <MainPage />,
  children: [
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/about",
      element: <AboutPage />,
    },
    {
      path: "/contact",
      element: <ContactPage />,
    },

    {
      path: "*",
      element: <HomePage />,
    },
  ],
};
