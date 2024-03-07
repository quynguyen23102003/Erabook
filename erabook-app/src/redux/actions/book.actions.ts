import { createAsyncThunk } from '@reduxjs/toolkit';
import { actionName, GetBooksResponse } from 'redux/types';
import { getBooks, getContentBook, getDetailBook } from 'services/api.service';
import { BookContentResponse, IGetBooks } from 'services/types';

export const fetchBooks = createAsyncThunk<
  GetBooksResponse,
  IGetBooks,
  {}
>(actionName.bookfetchBooks, async (payload) => {
  const page = payload?.page;
  return await getBooks({ page: page || 1 });
});

export const fetchBook = createAsyncThunk(
  actionName.fetchBook,
  async (bookId: string) => {
    return await getDetailBook(bookId);
  },
);

export const fetchContentBook = createAsyncThunk<BookContentResponse, string>(
  actionName.fetchContentBook,
  async (bookId: string) => {
    const result = await getContentBook(bookId);
    if (result === undefined) {
      throw new Error('Content book not found');
    }
    return result;
  },
);
