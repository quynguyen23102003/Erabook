import { createSlice } from "@reduxjs/toolkit";
import { SliceName } from "../types";


interface Dialog {
  status: boolean,
}

const initialState: Dialog = {
  status: false
};

const dialogSlice = createSlice({
  name: SliceName.Dialog,
  initialState: initialState,
  reducers: {
    showDialog(state) {
      state.status = true;
    },
    hideDialog(state) {
      state.status = false;
    }
  }
});

export const { showDialog, hideDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
