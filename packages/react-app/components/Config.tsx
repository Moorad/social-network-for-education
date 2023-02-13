import React, { useEffect } from 'react';

export default function Config() {
	useEffect(() => {
		if (!('theme' in localStorage)) {
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				localStorage.setItem('theme', 'dark');
				document.documentElement.classList.add('dark');
			} else {
				localStorage.setItem('theme', 'light');
				document.documentElement.classList.remove('dark');
			}
		} else {
			if (localStorage.getItem('theme') == 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}, []);

	return <></>;
}
