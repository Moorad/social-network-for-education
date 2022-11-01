import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export const modalsSlice = createSlice({
	name: 'modals',
	initialState: {
		showPostModal: false,
	},
	reducers: {
		showPostModal: (state) => {
			state.showPostModal = true;
		},

		hidePostModal: (state) => {
			state.showPostModal = false;
		},
	},
});

export const { showPostModal, hidePostModal } = modalsSlice.actions;

export default modalsSlice.reducer;

export const selectShowPost = (state: RootState) => state.modals.showPostModal;
