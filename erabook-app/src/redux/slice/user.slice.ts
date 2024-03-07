import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SliceName} from '../types';
import {fetchUserData, login} from '@redux/actions/user.actions';

interface UserState {
  userInfo: User | null;
  isLoading?: boolean;
}

const initialState: UserState = {
  userInfo: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: SliceName.User,
  initialState: initialState,
  reducers: {
    addUserData(state, action: PayloadAction<User>) {
      state.userInfo = action.payload;
    },
    removeUserData(state) {
      state.userInfo = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserData.pending, state => {
        // console.log('fetchUserData.pending');
        state.isLoading = true;
        state.userInfo = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        // console.log('fetchUserData.fulfilled');
        state.isLoading = false;
        state.userInfo = action.payload.data;
      })
      .addCase(fetchUserData.rejected, state => {
        // console.log('fetchUserData.rejected');
        state.isLoading = false;
        state.userInfo = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            accessToken: string;
            refreshToken: string;
          } | null>,
        ) => {
          // console.log('login.fulfilled');
          const user = action.payload?.user;
          if (user) {
            state.userInfo = user;
          }
        },
      );
  },
});

export const {addUserData, removeUserData} = userSlice.actions;

export default userSlice.reducer;
