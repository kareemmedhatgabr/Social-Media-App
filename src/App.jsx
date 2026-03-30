import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Register from "./Components/Register/Register";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Auth from "./Components/Auth/Auth";
import { HeroUIProvider } from "@heroui/react";
import Profile from "./Components/Profile/Profile";
import ProtectedRoutes from "./Components/ProtectedRoutes/ProtectedRoutes";
import AuthProtectedRoutes from "./Components/AuthProtectedRoutes/AuthProtectedRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails";
import UserProfile from "./Components/UserProfile/UserProfile";
import Notification from "./Components/Notification/Notification";
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import AuthContextProvider from "./Context/AuthiContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "auth",
        element: (
          <AuthProtectedRoutes>
            <Auth />
          </AuthProtectedRoutes>
        ),
      },
      {
        path: "register",
        element: (
          <AuthProtectedRoutes>
            <Register />
          </AuthProtectedRoutes>
        ),
      },
      {
        path: "login",
        element: (
          <AuthProtectedRoutes>
            <Login />
          </AuthProtectedRoutes>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "notification",
        element: (
          <ProtectedRoutes>
            <Notification />
          </ProtectedRoutes>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRoutes>
            <ChangePassword />
          </ProtectedRoutes>
        ),
      },
      {
        path: "usrprofile/:id",
        element: (
          <ProtectedRoutes>
            <UserProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "postdetails/:id",
        element: (
          <ProtectedRoutes>
            <PostDetails />
          </ProtectedRoutes>
        ),
      },
      {
        path: "*",
        element: (
          <div className="flex h-screen items-center justify-center bg-gray-600 text-white">
            <h2 className="text-3xl font-bold">404</h2>
          </div>
        ),
      },
    ],
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <HeroUIProvider>
          <RouterProvider router={router} />
        </HeroUIProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

