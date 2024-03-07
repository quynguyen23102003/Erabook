import {createSlice} from '@reduxjs/toolkit';
import {fetchGenres} from 'redux/actions/genre.actions';
import {SliceName} from 'redux/types';

interface GenreState {
  genreList: IGenre[];
  isLoading?: boolean;
}

const initialState: GenreState = {
  genreList: [],
  isLoading: false,
};

const genreSlice = createSlice({
  name: SliceName.Genre,
  initialState: initialState,
  reducers: {
    cleanGenreList: state => {
      state.genreList = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGenres.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genreList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGenres.rejected, state => {
        state.isLoading = false;
        console.log('error get genres');
      });
  },
});
export const {cleanGenreList} = genreSlice.actions;
export default genreSlice.reducer;
