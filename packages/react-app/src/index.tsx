import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	RouterProvider,
	Route
}  from 'react-router-dom';
import './index.css';
import Landing from './pages/landing/Landing';
import Authentication from './pages/authentication/Authentication';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Landing/>
	}, {
		path: '/signup',
		element: <Authentication type="SignUp"/>
	}
		
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
