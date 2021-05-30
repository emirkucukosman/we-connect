import React, { Suspense, Fragment, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LoadingScreen from "src/components/LoadingScreen";
import MainLayout from "src/layouts/MainLayout";
import GuestGuard from "src/components/GuestGuard";
import AuthGuard from "./components/AuthGuard";

export const renderRoutes = (routes: any[]) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            exact={route.exact}
            path={route.path}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes ? renderRoutes(route.routes) : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes: any[] = [
  {
    exact: true,
    path: "/404",
    component: lazy(() => import("./views/errors/NotFoundView")),
  },
  {
    path: "/account",
    guard: GuestGuard,
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: "/account/sign-in",
        component: lazy(() => import("./views/account/SignInView")),
      },
      {
        exact: true,
        path: "/account/sign-up",
        component: lazy(() => import("./views/account/SignUpView")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: "/profile",
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: "/profile",
        component: lazy(() => import("./views/profile/ProfileView")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: "*",
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: "/",
        component: lazy(() => import("./views/posts/ListPostsView")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

export default routes;
