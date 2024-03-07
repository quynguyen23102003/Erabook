export enum EndPoint {
  baseUrl = 'https://bookworm-server.fly.dev',
  // auth
  login = '/auth/login',
  refreshToken = '/auth/renew',
  signUp = '/auth/register',
  sendOTPCode = '/auth/recoverySendMail',
  validateOTPCode = '/auth/recoveryVerify',
  createNewPassword = '/auth/recoveryUpdate',
  updatePassword = '/account/updatePassword',

  //user
  account_details = '/account/details',
  update_account = '/account/update',

  //purchase
  addPaymentMethod = '/account/billing/addPaymentMethod',
  purchase = '/account/billing/purchase',
  getPaymentMethods = '/account/billing/getPaymentMethods',
  historyPurchase = '/account/billing/history',

  //book
  get_wishlist = '/books/getWishlist',
  booksrecent = '/books/recent',
  searchBooks = '/books/search?',
  getAllGenre = '/genres/getAll',
  addpayMentThod = '/account/billing/addPaymentMethod',
  getpayMentThod = '/account/billing/getPaymentMethods',
  deletePayMentThod = '/account/billing/removePaymentMethod',
  add_wishlist = '/books/:bookId/addWishlist',
  remove_wishlist = ' /books/:bookId/removeWishlist',
}

export enum account {
  details = '/account/details',
}

export type RefreshTokenResponse = {
  statusCode: number;
  data: {accessToken: string};
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type SignUpRequest = {
  username: string;
  emailAddress: string;
  password: string;
};

export type Chapters = {
  chapterTitle: string;
  chapterContent: string;
}[];

export type BookContentResponse = {
  bookName: string;
  allChapters: Chapters;
};

export interface BookContentWithLastRead extends BookContentResponse {
  lastReadOffset: number;
  _id: string;
}

export type AddPaymentMethodRequest = {
  _type: 'gpay' | 'momo' | 'visa' | 'mastercard' | 'zalopay';
  bankName: string;
  cardNumber: string;
  cardHolderName: string;
  cardSecret: string;
  cardExpiration: string;
};

export type PaymentMethod = {
  _id: string;
  _type: 'gpay' | 'momo' | 'visa' | 'mastercard' | 'zalopay';
  bankName: string;
  cardNumber: string;
  cardHolderName: string;
  cardExpiration: string;
};

export type Pagination = {
  currentPage: number;
  hasNext: boolean;
  itemCount: number;
  pageCount: number;
};
export interface CommmentResponse {
  pagination: Pagination;
  data: Comment[];
}

export interface Comment {
  _id: string;
  rating: number;
  comment: string;
  postDate: number;
  favorites: number;
  author: {
    _id: string;
    avatarUrl: string;
    fullName: string;
    username: string;
  };
  _user: {
    isFavorite: boolean;
  };
}

export type SignUpResponse = {
  status: number;
  message: string;
  data: {
    refreshToken: string;
    accessToken: string;
  };
};

export type UpdateUserResponse = {
  status: number;
  message: string;
};

export type GetTokenRequest = {
  username: string;
  password: string;
};

export type GetTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type TSortBook = {
  title?: string;
  lastUpdated?: number;
  releaseDate?: number;
  viewCount?: number;
  price?: number;
};
export interface IGetBooks {
  genre?: string;
  page: number;
  search?: string;
  sort?: TSortBook;
  asc?: boolean;
  limit?: number;
}
