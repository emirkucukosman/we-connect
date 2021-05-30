import React from "react";
import { Redirect } from "react-router-dom";
import useAuth from "src/hooks/useAuth";

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
