import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>

      <main className="grow">
        <Outlet />
      </main>

      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
