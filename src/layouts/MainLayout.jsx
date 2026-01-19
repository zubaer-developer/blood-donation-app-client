import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const MainLayout = () => {
  const { pathname } = useLocation();

  // reset scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />

      {/* dynamic page content */}
      <main className="grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
