import { Link, Outlet, useLocation } from "react-router-dom";

export default function MainPage() {
  const location = useLocation();
  const activeTab = location.pathname;

  return (
    <section>
      <header className=" bg-primary dark:bg-primary/90 px-4 pt-4 pb-2">
        <h1 className="text-[24px] text-primary-foreground font-medium">
          Website and Academic journal System
        </h1>
        <header className="space-x-4 text-primary-foreground mt-8 overflow-auto">
          <Link
            to="/home"
            className={`${
              (activeTab.startsWith("/archives") || activeTab.length == 1) &&
              "border-b"
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`${activeTab.startsWith("/submission") && "border-b"}`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`${activeTab.startsWith("/submission") && "border-b"}`}
          >
            Contact
          </Link>
        </header>
      </header>
      <Outlet />
    </section>
  );
}
