import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
