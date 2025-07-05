import React from "react";
import LoginEmailPage from "./component/login/LoginEmailPage";
import Loginpassword from "./component/login/LoginPassword";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminContact from "./component/login/AdminContact";
import './App.css'
const Router = createBrowserRouter([
  {
    path: "/login/email",
    element: (
      <>
        <LoginEmailPage />
      </>
    ),
  },
  {
    path: "/login/password",
    element: (
      <>
        <Loginpassword email={"WahbAmir@gmail.com"} />
      </>
    ),
  },
  {
    path: "/admin/contact",
    element: (
      <>
        <AdminContact />
      </>
    ),
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={Router} />
    </>
  );
}

export default App;
