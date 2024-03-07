import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { reduxStorage } from './mmkv';
import UserReducer from '../slice/user.slice';
import SettingReducer from '../slice/setting.slice';
import DialogReducer from '../slice/dialog.slice';
import BottomSheetReducer from '../slice/bottomsheet.slice';
import AppReducer from '../slice/app.slice';
import BookReducer from '../slice/book.slice';
import GenreReducer from '../slice/genre.slice';
import purchasedSlice from '@redux/slice/purchased.slice';
import trackSlice from '@redux/slice/track.slice';

const rootReducer = combineReducers({
  user: UserReducer,
  setting: SettingReducer,
  dialog: DialogReducer,
  bottomSheet: BottomSheetReducer,
  app: AppReducer,
  book: BookReducer,
  genre: GenreReducer,
  purchased: purchasedSlice.reducer,
  track: trackSlice,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: reduxStorage,
  timeout: 0,
  blacklist: [
    'dialog',
    'bottomSheet',
    'book',
    'genre',
    'purchased',
    'track'
  ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    root: persistedReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const persistor = persistStore(store);

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
