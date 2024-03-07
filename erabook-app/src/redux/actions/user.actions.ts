import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../storeAndStorage/persist";
import { getUserInfo } from "../../services/api.service";
import { signIn } from "@services/auth.service";
import { LoginRequest } from "@services/types";

export interface SignInFormValues {
  username: string;
  password: string;
}

export const fetchUserData = createAsyncThunk<
  any,
  undefined,
  { state: RootState }
>("user/get", async (arg, thunkAPI) => {
  try {
    const res = await getUserInfo();
    if (res) {
      return res;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
});

export const login = createAsyncThunk<
  {
    user: User;
    accessToken: string;
    refreshToken: string;
  } | null,
  LoginRequest,
  { state: RootState }
>("user/login", async (payload, thunkAPI) => {
  try {
    const res = await signIn(payload);
    if (res) {
      return res;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
})
