import type { UserType } from 'node-server/Models/User';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		displayName: '',
		description: '',
		label: 'No label',
		followerCount: 0,
		followers: [],
		followingCount: 0,
		followings: [],
		posts: [],
		avatar: '',
		_id: '',
		isPrivate: false,
		background: ''
	} as UserType,
	reducers: {
		setUser: (state, action: PayloadAction<UserType>) => {
			return { ...action.payload };
		},

		setAvatar: (state, action) => {
			state.avatar = action.payload;
		},
	},
});

export const { setUser, setAvatar } = userSlice.actions;

export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user;
export const selectAvatar = (state: RootState) => state.user.avatar;
export const selectDisplayName = (state: RootState) => state.user.displayName;
export const selectId = (state: RootState) => state.user._id;
export const selectBackground = (state: RootState) => state.user.background;
export const selectDescription = (state: RootState) => state.user.description;
export const selectLabel = (state: RootState) => state.user.label;

