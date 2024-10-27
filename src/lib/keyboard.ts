import { NavigateFunction } from "react-router-dom";

interface handleKeyPressProps {
  event: any;
  logout: () => Promise<void>;
  navigate: NavigateFunction;
}
export const handleKeyPress = async (props: handleKeyPressProps) => {
  const { event, logout, navigate } = props;
  if (event.altKey) {
    if (event.altKey && event.key === "p")
      navigate("/users/profile", { replace: true });
    if (event.altKey && event.key === "s")
      navigate("/settings", { replace: true });
    if (event.altKey && event.key === "d")
      navigate("/dashboard", { replace: true });
    if (event.altKey && event.key === "r")
      navigate("/reports", { replace: true });
    if (event.altKey && event.key === "u")
      navigate("/users", { replace: true });
    if (event.altKey && event.key === "q") await logout();
  }
};
