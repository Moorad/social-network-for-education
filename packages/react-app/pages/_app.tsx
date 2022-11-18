import { AppProps } from 'next/dist/shared/lib/router/router';
import Head from 'next/head';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import '../index.css';
import store from '../redux/store';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<Head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<title>React App</title>
			</Head>
			<Component {...pageProps} />
			<Toaster position='bottom-right' />
		</Provider>
	);
}
