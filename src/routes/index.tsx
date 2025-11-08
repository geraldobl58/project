import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

import { RootLayout } from "@/layouts/RootLayout";
import { Loading } from "@/components/loading";

const UsersPage = lazy(() =>
  import("../pages/users/users-page").then((module) => ({
    default: module.UsersPage,
  }))
);

const UsersDetailsPage = lazy(() =>
  import("../pages/users/users-details-page").then((module) => ({
    default: module.UsersDetailsPage,
  }))
);

const UsersCreateUpdate = lazy(() =>
  import("../pages/users/user-create-update").then((module) => ({
    default: module.UsersCreateUpdate,
  }))
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={<Loading message="Carregando página de usuários..." />}
          >
            <UsersPage />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense
            fallback={<Loading message="Carregando página de usuários..." />}
          >
            <UsersPage />
          </Suspense>
        ),
      },
      {
        path: "users/create",
        element: (
          <Suspense fallback={<Loading message="Carregando formulário..." />}>
            <UsersCreateUpdate />
          </Suspense>
        ),
      },
      {
        path: "users/:id",
        element: (
          <Suspense
            fallback={<Loading message="Carregando página de usuários..." />}
          >
            <UsersDetailsPage />
          </Suspense>
        ),
      },
      {
        path: "users/:id/edit",
        element: (
          <Suspense fallback={<Loading message="Carregando formulário..." />}>
            <UsersCreateUpdate />
          </Suspense>
        ),
      },
    ],
  },
];
