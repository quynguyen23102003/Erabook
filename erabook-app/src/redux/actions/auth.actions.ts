import {createAsyncThunk} from '@reduxjs/toolkit';
import {renewToken} from '@services/auth.service';
import {RootState} from '@redux/storeAndStorage/persist';
import {getUserInfo} from '@services/api.service';

export const refreshToken = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  string,
  {state: RootState}
>('auth/refreshToken', async (refreshToken, thunkApi) => {
  try {
    const res = await renewToken(refreshToken);
    if (res) {
      return res;
    } else {
      return {refreshToken: '', accessToken: ''};
    }
  } catch (error) {
    console.log('action refreshToken error', error);
    return {refreshToken: '', accessToken: ''};
  }
});

export const getAccountInfo = createAsyncThunk<User | null>(
  'auth/getAccountInfo',
  async () => {
    try {
      return await getUserInfo();
    } catch (error) {
      console.log('action refreshToken error', error);
      return null;
    }
  },
);
