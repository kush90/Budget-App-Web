import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import Signup from './pages/Signup.js';
import Home from './pages/Home.js';
import Main from './layouts/Main.js';
import Error from './pages/Error.js';
import BudgetDetail from './pages/BudgetDetail.js';
import { DataProvider } from './context';
import Profile  from './pages/profile.js'
import ForgotPassword from './pages/ForgotPassword.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <Signup/>,
    errorElement:<Error/>
  },
  {
    path: "/forgot",
    element: <ForgotPassword/>,
    errorElement:<Error/>
  },
  {
    path:'/home',
    element:<Main/>,
    errorElement: <Error />,
    children:[
        {
          path:'/home',
          element: <Home/>
        },
        {
          path: "profile",
          element: <Profile/>,
          errorElement:<Error/>
        },
        {
          path: "budget/:id",
          element: <BudgetDetail/>,
          errorElement:<Error/>
        },
       
    ]
  }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DataProvider>
     <RouterProvider router={router} />
    {/* <App /> */}
  </DataProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
