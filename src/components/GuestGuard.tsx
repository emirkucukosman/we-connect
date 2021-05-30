import React from "react";
import { Redirect } from "react-router-dom";
import useAuth from "src/hooks/useAuth";

type GuestGuardProps = {
  children: React.ReactNode;
};

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};

export default GuestGuard;
