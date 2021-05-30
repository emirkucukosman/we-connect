import React from "react";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "src/contexts/AuthContext";
import routes, { renderRoutes } from "./routes";

const App = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <AuthProvider>{renderRoutes(routes)}</AuthProvider>
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;
