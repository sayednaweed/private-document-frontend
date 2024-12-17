import {
  getAdminRouter,
  getDebuggerRouter,
  getGuestRouter,
  getSuperRouter,
  getUserRouter,
} from "./routes/routes";
import { useAuthState } from "./context/AuthContextProvider";
import {
  ROLE_ADMIN,
  ROLE_DEBUGGER,
  ROLE_SUPER,
  ROLE_USER,
} from "./lib/constants";

export default function App() {
  const { user, loading, authenticated } = useAuthState();
  if (loading) return;
  let routes = null;
  if (!authenticated) routes = getGuestRouter();
  else {
    routes =
      user.role.role == ROLE_USER
        ? getUserRouter(user)
        : user.role.role == ROLE_ADMIN
        ? getAdminRouter(user)
        : user.role.role == ROLE_SUPER
        ? getSuperRouter(user)
        : user.role.role == ROLE_DEBUGGER
        ? getDebuggerRouter(user)
        : getGuestRouter();
  }
  return routes;
}
