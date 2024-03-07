import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SliceName, storageKey} from '../types';
import {fetchUserData, login} from '../actions/user.actions';
import {refreshToken} from '@redux/actions/auth.actions';
import {appStorage} from '@redux/storeAndStorage/mmkv';
import {FontFamilyType, TextAlignType} from '@screens/ReadBook/ReadbookScreen';

interface AppSliceState {
  isLoading?: boolean;
  login?: boolean;
  isLoginError: boolean;
  tokens: {
    accessToken: string;
    refreshToken: string;
    isError: boolean;
  };
  rfTokenLoading?: boolean;
  // states of botttom sheet in read book screen
  readBookSreenBrightness: number;
  readBookBrightnessType: 'custom' | 'auto';
  readBookFontFamily: FontFamilyType;
  readBookTextAlign: TextAlignType;
  readBookFontSize: number;
}

const initialState: AppSliceState = {
  isLoading: false,
  login: false,
  isLoginError: false,
  tokens: {
    accessToken: '',
    refreshToken: '',
    isError: false,
  },
  rfTokenLoading: false,
  readBookSreenBrightness: -1,
  readBookBrightnessType: 'auto',
  readBookFontFamily: 'Poppins-Regular',
  readBookFontSize: 16,
  readBookTextAlign: 'left',
};

const appSlice = createSlice({
  name: SliceName.App,
  initialState,
  reducers: {
    saveReadBookState(
      state,
      action: PayloadAction<{
        fontFamily: FontFamilyType;
        fontSize: number;
        textAlign: TextAlignType;
        brightneses: number;
        brightnesesType: 'custom' | 'auto';
      }>,
    ) {
      const payload = action.payload;
      console.log('payload.brightnesesType', payload.brightnesesType);

      state.readBookFontFamily = payload.fontFamily;
      state.readBookFontSize = payload.fontSize;
      state.readBookSreenBrightness = payload.brightneses;
      state.readBookTextAlign = payload.textAlign;
      state.readBookBrightnessType = payload.brightnesesType;
    },

    setReadBookBrightnessType(state, action: PayloadAction<'custom' | 'auto'>) {
      state.readBookBrightnessType = action.payload;
    },

    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setLogin(state, action: PayloadAction<boolean>) {
      state.login = action.payload;
    },
    resetIsLoginError(state) {
      state.isLoginError = false;
    },
    clearData(state) {
      state.isLoading = false;
      state.login = false;
      state.tokens = {
        accessToken: '',
        refreshToken: '',
        isError: false,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserData.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchUserData.fulfilled, state => {
        state.isLoading = false;
        // state.login = true;
      })
      .addCase(fetchUserData.rejected, state => {
        state.isLoading = false;
        // state.login = false;
      })
      .addCase(login.pending, state => {
        state.isLoginError = false;
        state.isLoading = true;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string;
            refreshToken: string;
            user: User;
          } | null>,
        ) => {
          state.isLoading = false;
          console.log('action.payload:', action.payload);
          appStorage.set(storageKey.accessToken, '');
          appStorage.set(storageKey.refreshToken, '');
          if (action.payload !== null) {
            state.isLoginError = false;
            state.login = true;
            if (action.payload?.accessToken && action.payload?.refreshToken) {
              state.tokens.accessToken = action.payload.accessToken;
              appStorage.set(
                storageKey.accessToken,
                action.payload.accessToken,
              );
              state.tokens.refreshToken = action.payload.refreshToken;
              appStorage.set(
                storageKey.refreshToken,
                action.payload.refreshToken,
              );
            } else {
              state.isLoginError = true;
              state.login = false;
            }
          } else {
            state.isLoginError = true;
            state.login = false;
          }
        },
      )
      .addCase(login.rejected, state => {
        state.isLoading = false;
        state.login = false;
      })
      .addCase(refreshToken.pending, state => {
        state.rfTokenLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        const {accessToken, refreshToken} = action.payload;
        state.rfTokenLoading = false;
        if (accessToken) {
          state.tokens.accessToken = accessToken;
          appStorage.set(storageKey.accessToken, accessToken);
        }
        if (refreshToken) {
          state.tokens.refreshToken = refreshToken;
          appStorage.set(storageKey.refreshToken, refreshToken);
        }
        console.log('app slice:  new accessToken', accessToken);
        console.log('app slice:  new refreshToken', refreshToken);
        if (!accessToken || !refreshToken) {
          state.tokens.isError = true;
        } else {
          state.tokens.isError = false;
        }
      });
  },
});

export const {
  setIsLoading,
  setLogin,
  clearData,
  resetIsLoginError,
  saveReadBookState,
  setReadBookBrightnessType,
} = appSlice.actions;
export default appSlice.reducer;
