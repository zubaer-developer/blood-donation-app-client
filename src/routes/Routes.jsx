import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import SearchPage from "../pages/Search/SearchPage";
import DonationRequests from "../pages/DonationRequests/DonationRequests";
import DonationRequestDetails from "../pages/DonationRequests/DonationRequestDetails";
import Funding from "../pages/Funding/Funding";
import Profile from "../pages/Dashboard/Profile/Profile";
import DonorHome from "../pages/Dashboard/Donor/DonorHome";
import CreateDonationRequest from "../pages/Dashboard/Donor/CreateDonationRequest";
import MyDonationRequests from "../pages/Dashboard/Donor/MyDonationRequests";
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import AllDonationRequests from "../pages/Dashboard/Admin/AllDonationRequests";
import ContentManagement from "../pages/Dashboard/Admin/ContentManagement";
import PrivateRoute from "./PrivateRoute";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import EditDonationRequest from "../pages/Dashboard/Donor/EditDonationRequest";
import VolunteerDonationRequests from "../pages/Dashboard/Volunteer/VolunteerDonationRequests";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/donation-requests",
        element: <DonationRequests />,
      },
      {
        path: "/donation-requests/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/funding",
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Common Routes
      {
        path: "/dashboard",
        element: <DashboardHome />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
      // Donor Routes
      {
        path: "/dashboard/create-donation-request",
        element: <CreateDonationRequest />,
      },
      {
        path: "/dashboard/my-donation-requests",
        element: <MyDonationRequests />,
      },
      {
        path: "/dashboard/edit-donation-request/:id",
        element: <EditDonationRequest />,
      },
      // Admin Routes
      {
        path: "/dashboard/admin-home",
        element: <AdminHome />,
      },
      {
        path: "/dashboard/all-users",
        element: <AllUsers />,
      },
      {
        path: "/dashboard/all-blood-donation-request",
        element: <AllDonationRequests />,
      },
      {
        path: "/dashboard/content-management",
        element: <ContentManagement />,
      },

      // Volunteer routes
      {
        path: "/dashboard/volunteer/all-blood-donation-request",
        element: <VolunteerDonationRequests />,
      },
    ],
  },
]);
