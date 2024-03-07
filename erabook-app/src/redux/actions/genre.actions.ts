import { createAsyncThunk } from "@reduxjs/toolkit";
import { actionName } from "redux/types";
import { getAllGenres } from "services/api.service";

export const fetchGenres = createAsyncThunk<
  IGenre[],
  void,
  { rejectValue: string }
>(
  actionName.genrefetchGenres,
  async () => {
    return await getAllGenres();
  },
);
