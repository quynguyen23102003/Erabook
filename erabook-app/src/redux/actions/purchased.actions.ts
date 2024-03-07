import {GetPurchasedResponse, actionName} from '@redux/types';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {getAllPurchasesBook} from '@services/api.service';

export const fetchPurchasesBook = createAsyncThunk<GetPurchasedResponse>(
  actionName.fetchPurchasesBook,
  async (_, {rejectWithValue}) => {
    try {
      return await getAllPurchasesBook();
    } catch (error) {
      console.log('fetchBooks error', error);
      return rejectWithValue(error);
    }
  },
);
