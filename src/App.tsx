import { RouterProvider } from "react-router-dom";
import {
  getAdminRouter,
  getGuestRouter,
  getSuperRouter,
  getUserRouter,
} from "./routes/routes";
import { useAuthState } from "./context/AuthContextProvider";

export default function App() {
  const { user, loading, authenticated } = useAuthState();
  if (loading) return;
  let routes = null;
  if (!authenticated) routes = getGuestRouter();
  else {
    routes =
      user.role.role == 1
        ? getUserRouter(user)
        : user.role.role == 2
        ? getAdminRouter(user)
        : user.role.role == 4
        ? getSuperRouter(user)
        : getGuestRouter();
  }

  return <RouterProvider router={routes} />;
}
