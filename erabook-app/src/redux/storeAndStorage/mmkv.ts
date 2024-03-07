import {Storage} from 'redux-persist';
import {MMKV} from 'react-native-mmkv';

export const appStorage = new MMKV();
export const reduxStorage: Storage = {
  setItem: (key, value) => {
    appStorage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = appStorage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    appStorage.delete(key);
    return Promise.resolve();
  },
};
