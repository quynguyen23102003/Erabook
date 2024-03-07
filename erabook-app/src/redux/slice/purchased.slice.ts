import {fetchPurchasesBook} from '@redux/actions/purchased.actions';
import {GetPurchasedResponse, SliceName} from '@redux/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BookContentWithLastRead} from '@services/types';

interface BookState {
  bookList: IBook[];
  isLoading: boolean;
  pagination: IPagination;
  bookContent: {
    [bookId: string]: BookContentWithLastRead;
  };
}

const initialState: BookState = {
  bookList: [],
  isLoading: false,
  pagination: {
    currentPage: 0,
    hasNext: false,
    itemCount: 0,
    pageCount: 0,
  },
  bookContent: {},
};

const purchasedSlice = createSlice({
  name: SliceName.Purchased,
  initialState: initialState,
  reducers: {
    addBookContent(state, action: PayloadAction<BookContentWithLastRead>) {
      const book = action.payload;
      state.bookContent[book._id] = book;
    },

    addBookToPurchasedList(state, action: PayloadAction<IBook>) {
      state.bookList = [...state.bookList, action.payload];
    },

    clearPurchasedList(state) {
      state.bookList = [];
    },
    setLastRead(
      state,
      action: PayloadAction<{bookId: string; lastRead: number}>,
    ) {
      const {bookId, lastRead} = action.payload;
      const book = state.bookContent[bookId];
      book.lastReadOffset = lastRead;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchPurchasesBook.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchPurchasesBook.rejected, state => {
        state.bookList = [];
        state.isLoading = false;
        state.pagination = {
          currentPage: 0,
          hasNext: false,
          itemCount: 0,
          pageCount: 0,
        };
      })
      .addCase(
        fetchPurchasesBook.fulfilled,
        (state, action: PayloadAction<GetPurchasedResponse>) => {
          const books = action.payload.data.map(i => i.books).flat();
          if (books.length === 0) {
            state.bookList = [];
            state.pagination = action.payload?.pagination || {
              currentPage: 0,
              hasNext: false,
              itemCount: 0,
              pageCount: 0,
            };
          } else {
            state.bookList = [...books];
            state.pagination = action.payload?.pagination;
          }
          state.isLoading = false;
        },
      );
  },
});

export const {
  addBookContent,
  addBookToPurchasedList,
  clearPurchasedList,
  setLastRead,
} = purchasedSlice.actions;
export default purchasedSlice;
