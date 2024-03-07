import axios from 'axios';
import {EndPoint} from './types';
import {appStorage} from '@redux/storeAndStorage/mmkv';
import {storageKey} from '@redux/types';
import {store} from '@redux/storeAndStorage/persist';
import {refreshToken} from '@redux/actions/auth.actions';
import {clearData} from '@redux/slice/app.slice';

export const callApi = (contentType = 'application/json') => {
  const axiosInstance = axios.create({
    baseURL: EndPoint.baseUrl,
  });

  axiosInstance.interceptors.request.use(
    config => {
      const token = appStorage.getString(storageKey.accessToken);
      if (token && token.length > 0) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers.Accept = 'application/json';
      config.headers['Content-Type'] = contentType;
      return config;
    },
    err => Promise.reject(err),
  );
  axiosInstance.interceptors.response.use(
    res => {
      return res.data;
    },
    async err => {
      console.log('axiosInstance interceptors log:', err.response.data);
      const originalRequest = err.config;
      if (!err.response) {
        console.log('axiosInstance interceptors network error');
        return Promise.reject(err);
      }
      if (err.response.data.status === 401) {
        let refreshTokenValue = appStorage.getString(storageKey.refreshToken);
        appStorage.set(storageKey.accessToken, '');
        appStorage.set(storageKey.refreshToken, '');
        if (!refreshTokenValue || refreshTokenValue.length == 0) {
          return store.dispatch(clearData());
        }
        return store.dispatch(refreshToken(refreshTokenValue)).then(() => {
          const {tokens} = store.getState()?.root.app;
          if (tokens.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return axiosInstance(originalRequest);
          }
        });
        // const newAccessToken = await refreshToken();
        // console.log("new access token", newAccessToken);
        // if (newAccessToken) {
        //   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        //     return axiosInstance(originalRequest);
        // } else {
        //   return Promise.reject("refresh token error");
        // }
      }
      return Promise.reject(err);
    },
  );
  return axiosInstance;
};
