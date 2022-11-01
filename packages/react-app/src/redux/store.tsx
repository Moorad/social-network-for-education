import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import modalsReducer from './modalsSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		modals: modalsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
