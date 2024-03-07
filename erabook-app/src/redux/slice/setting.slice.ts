import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceName } from "../types";

export enum ThemeKey {
  SystemDefault = "SystemDefault",
  Light = "Light",
  Dark = "Dark",
}

interface Setting {
  themeColor: ThemeKey,
}

const initialState: Setting = {
  themeColor: ThemeKey.SystemDefault
};

const userSlice = createSlice({
  name: SliceName.Setting,
  initialState: initialState,
  reducers: {
    changeThemeColor(state, action: PayloadAction<ThemeKey>) {
      state.themeColor = action.payload;
    }
  }
});

export const { changeThemeColor } = userSlice.actions;

export default userSlice.reducer;
