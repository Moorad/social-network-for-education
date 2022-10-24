import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Landing from './pages/landing/Landing';
import Authentication from './pages/authentication/Authentication';
import Home from './pages/home/Home';
import RequireAuth from './utils/RequireAuth';
import Profile from './pages/profile/Profile';
import UserInParams from './pages/user/UserInParams';
import { Provider } from 'react-redux';
import store from './redux/store';
import NotFound from './pages/notFound/NotFound';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Landing />} />
					<Route
						path='/signup'
						element={<Authentication type='SignUp' />}
					/>
					<Route
						path='/signin'
						element={<Authentication type='SignIn' />}
					/>

					{/* Requires Auth */}
					<Route element={<RequireAuth />}>
						<Route path='/home' element={<Home />} />
						<Route path='/profile' element={<Profile />}></Route>
						<Route
							path='/user/:id'
							element={<UserInParams />}
						></Route>
					</Route>

					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
