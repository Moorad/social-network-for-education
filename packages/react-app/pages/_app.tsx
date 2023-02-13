import { AppProps } from 'next/dist/shared/lib/router/router';
import Head from 'next/head';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import Config from '../components/Config';
import { SocketProvider } from '../components/SocketContext';
import '../index.css';
import store from '../redux/store';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<SocketProvider>
					<Head>
						<meta charSet='utf-8' />
						<meta
							name='viewport'
							content='width=device-width, initial-scale=1'
						/>
						<title>React App</title>
					</Head>
					<Config />
					<Component {...pageProps} />
					<Toaster position='bottom-right' />
					<ReactQueryDevtools initialIsOpen={false} />
				</SocketProvider>
			</QueryClientProvider>
		</Provider>
	);
}
