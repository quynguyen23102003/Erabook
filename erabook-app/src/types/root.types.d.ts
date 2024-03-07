enum UserGender {
  Men = 'Nam',
  Women = 'Nữ',
  Other = 'Khác',
}

type Wishlist = {
  bookId: string;
  timestamp: number;
};

type Shelf = {
  bookId: string;
  lastPage: number;
  timestamp: number;
};

interface User {
  _id: string;
  username: string;
  emailAddress: string;
  createdAt: number;
  avatarUrl?: string;
  fullName?: string;
  contactAddress?: string;
  country?: string;
  phoneAddress?: string;
  gender?: UserGender.Men | UserGender.Women | UserGender.Other;
  birthDate?: string;
  wishlist?: Wishlist[];
  shelf?: Shelf[];
  payment?: IPaymentMethod[];
}

type TBookAuthor = {
  _id: string;
  name: string;
  biography: string;
};

type TBookGenres = {
  _id: string;
  name: string;
  description: string;
};

type TUserBook = {
  isPurchased: boolean;
  readingState?: {
    lastPage: number;
    timestamp: number;
  };
  existingRating?: {
    rating?: number;
  };
};

type TBookRating = {
  count: number;
  average: number;
  percentage: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
};

interface IBook {
  _id: string;
  author?: TBookAuthor;
  genres?: TBookGenres[];
  title: string;
  description: string;
  releaseDate: number;
  publicationYear?: number;
  reprintYear?: number;
  language?: string;
  edition?: string;
  coverImage: string;
  pageCount: number;
  price?: number;
  viewCount?: number;
  lastUpdated?: number;
  rating: TBookRating;
  _user?: TUserBook;
  purchaseCount: number;
}
interface IGenre {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
}

interface IPagination {
  currentPage: number;
  hasNext: boolean;
  itemCount: number;
  pageCount: number;
}

interface BookResponse {
  data: IBook[];
  pagination: IPagination;
}

type IPaymentMethod = {
  _id: string;
  _type: 'gpay' | 'momo' | 'visa' | 'mastercard' | 'zalopay';
  bankName: string;
  cardNumber: string;
  cardHolderName: string;
  cardSecret: string;
  cardExpiration: string;
  onPress?: () => void;
};

interface IHistory {
  _id: string;
  books: IBook[];
  timestamp: number;
  status: string;
  paymentMethod: paymentMethodHistory;
}

type paymentMethodHistory = {
  _id: string;
  _type: string;
  bankName?: string;
  cardNumber: string;
};


interface AudioFile {
  id: string;
  url: string;
  title: string;
}