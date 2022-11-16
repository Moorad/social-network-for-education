import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserSafe } from 'common';
import { RootState } from './store';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		displayName: '',
		description: '',
		label: 'No label',
		followerCount: 0,
		followingCount: 0,
		posts: [],
		avatar: '',
		_id: '',
		isPrivate: false,
	} as IUserSafe,
	reducers: {
		setUser: (state, action: PayloadAction<IUserSafe>) => {
			state.displayName = action.payload.displayName;
			state.description = action.payload.description;
			state.label = action.payload.label;
			state.followerCount = action.payload.followerCount;
			state.followingCount = action.payload.followingCount;
			state.posts = action.payload.posts;
			state.avatar = action.payload.avatar;
			state._id = action.payload._id;
			state.isPrivate = action.payload.isPrivate;
			state.background = action.payload.background;
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
