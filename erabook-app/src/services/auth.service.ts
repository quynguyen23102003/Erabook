import {appStorage} from '@redux/storeAndStorage/mmkv';
import {storageKey} from '@redux/types';
import {
  EndPoint,
  GetTokenRequest,
  GetTokenResponse,
  LoginRequest,
  SignUpRequest,
  SignUpResponse,
} from '@services/types';
import {callApi} from '@services/axios.service';
import {getUserInfo} from '@services/api.service';
import axios from 'axios';

export const sendOTPCode = async (email: string) => {
  try {
    await callApi().post(EndPoint.sendOTPCode, {
      emailAddress: email,
    });
  } catch (error) {
    console.log('sendOTPCode error: ', error);
  }
};

export const validateOTPCode = async (emailAddress: string, code: string) => {
  try {
    await callApi().post(EndPoint.validateOTPCode, {emailAddress, code});
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('validateOTPCode error');
    } else {
      console.log('validateOTPCode unexpected error: ', error);
    }
    return false;
  }
};

export const createNewPassword = async (
  emailAddress?: string,
  code?: string,
  password?: string,
) => {
  try {
    await callApi().post(EndPoint.createNewPassword, {
      emailAddress,
      code,
      password,
    });
    return true;
  } catch (error) {
    console.log('createNewPassword error', error);
    return false;
  }
};

export const signIn = async (payload: LoginRequest) => {
  try {
    // console.log('signIn', payload);
    appStorage.set(storageKey.accessToken, '');
    appStorage.set(storageKey.refreshToken, '');
    const responses = await getToken(payload);
    if (responses) {
      const user: User | null = await getUserInfo();
      if (user) {
        return {
          user: user,
          accessToken: responses.accessToken,
          refreshToken: responses.refreshToken,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const signUp = async (payload: SignUpRequest) => {
  try {
    const response: SignUpResponse = await callApi().post(
      EndPoint.signUp,
      payload,
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      console.log('signUp unexpected error: ', error);
      return null;
    }
  }
};

export const getToken = async (payload: GetTokenRequest) => {
  try {
    console.log('payload', payload);
    const {data, status} = await callApi().post(EndPoint.login, payload);
    console.log('getToken', data, status);
    if (status === 200) {
      const responseData: GetTokenResponse = data;
      appStorage.set(storageKey.accessToken, responseData.accessToken);
      appStorage.set(storageKey.refreshToken, responseData.refreshToken);
      return responseData;
    } else {
      console.log('getToken status', status, '----data', data);
      return null;
    }
  } catch (error) {
    console.log('getToken err', error);
    return null;
  }
};

export const renewToken = async (rfToken: string) => {
  try {
    const {data, status} = await callApi().post<GetTokenResponse>(
      EndPoint.refreshToken,
      {refreshToken: rfToken},
    );
    console.log('refreshToken res', data, status);
    if (status === 200) {
      if (!data.accessToken) {
        return null;
      }
      appStorage.set(storageKey.accessToken, data.accessToken);
      appStorage.set(storageKey.refreshToken, data.refreshToken);
      return data;
    } else {
      console.log('refreshToken is expired');
      console.log('refreshToken status', status, '----data', data);
      return null;
    }
  } catch (error) {
    console.log('refreshToken err', error);
    return null;
  }
};

export const signOut = () => {
  appStorage.set(storageKey.accessToken, '');
  appStorage.set(storageKey.refreshToken, '');
  return true;
};
