import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceName } from "../types";

export enum BottomSheetName {
  ChangeTheme = "ChangeTheme",
}

interface BottomSheetPayload {
  name: BottomSheetName,
  status: boolean,
}

interface BottomSheet {
  ChangeThemeBottomSheet: boolean,
}

const initialState: BottomSheet = {
  ChangeThemeBottomSheet: false
};

const bottomSheetSlice = createSlice({
  name: SliceName.BottomSheet,
  initialState: initialState,
  reducers: {
    bottomSheet(state, action: PayloadAction<BottomSheetPayload>) {
      switch (action.payload.name) {
        case BottomSheetName.ChangeTheme:
          state.ChangeThemeBottomSheet = action.payload.status;
          break;
        default:
          break;
      }
    }
  }
});

export const {
  bottomSheet
} = bottomSheetSlice.actions;

export default bottomSheetSlice.reducer;
