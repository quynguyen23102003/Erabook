export enum SliceName {
  User = 'user',
  Setting = 'setting',
  Dialog = 'dialog',
  BottomSheet = 'bottomSheet',
  App = 'app',
  Book = 'books',
  Genre = 'genres',
  Purchased = 'purchased',
  Track = 'track',
}

export interface Types {
  user: UserState;
  dialog: DialogType;
  navigator: NavigatorState;
  otpcode: OTPCode;
}

export interface NavigatorState {
  routeName: string;
}

export interface UserType {
  id: string;
  email: string;
  username: string;
  password: string;
  age: number | null;
  avatar: string | null;
  country: string | null;
  subcriptionStatus: boolean | null;
  subscriptionEndDate: Date | null;
  favoriteBooks: Array<BookType>;
  readingHistory: Array<BookType>;
}

export interface BookType {
  id: string;
  title: string | null;
  author: string | null;
  description: string | null;
  genre: string | null;
  coverImage: string | null;
  averageRating: number | null;
  reviews: ReviewType;
}

export interface ReviewType {
  user: string;
  content: string;
  rating: number;
  createdAt: Date;
}

export interface UserState {
  currentUser: UserType;
}

export interface OTPCode {
  code: number[];
  email: string;
  status: boolean;
}

export interface DialogType {
  choose: number;
  title: string;
  content: string;
  buttonText: string;
  actionType: number;
  visible: boolean;
}

export enum storageKey {
  refreshToken = 'refreshToken',
  accessToken = 'accessToken',
  language = 'language',
}
export enum actionName {
  fetchBook = 'book/fetchBook',
  bookfetchBooks = 'books/fetchBooks',
  genrefetchGenres = 'genres/fetchGenres',
  fetchPurchasesBook = 'purchases/fetchPurchasesBook',
  fetchContentBook = 'purchases/fetchContentBook',
}
export interface GetBooksResponse {
  data: IBook[];
  pagination: {
    currentPage: number;
    hasNext: boolean;
    itemCount: number;
    pageCount: number;
  };
}

export interface GetPurchasedResponse {
  data: {
    books: IBook[];
  }[];
  pagination: {
    currentPage: number;
    hasNext: boolean;
    itemCount: number;
    pageCount: number;
  };
}
