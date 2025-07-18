import React from "react";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./componentes/Sidebar";
import { Outlet } from "react-router";

export const AuthWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <>
      <Sidebar />
      <Outlet/>
      </>
  ) : (
    <>{children}</>
  );
};

