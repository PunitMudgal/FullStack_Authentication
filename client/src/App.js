import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import Password from "./components/Password";
import Profile from "./components/Profile";
import Recovery from "./components/Recovery";
import Reset from "./components/Reset";
import Username from "./components/Username";
import Register from "./components/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="font-bold text-5xl text-slate-600 bg-red-600">
        Root Route
      </div>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/username",
    element: <Username />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/reset",
    element: <Reset />,
  },
  {
    path: "/recovery",
    element: <Recovery />,
  },
  {
    path: "/password",
    element: <Password />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
