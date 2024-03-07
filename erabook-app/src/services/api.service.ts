import axios from 'axios';
import {callApi} from './axios.service';
import {
  AddPaymentMethodRequest,
  BookContentResponse,
  CommmentResponse,
  EndPoint,
  IGetBooks,
  PaymentMethod,
} from './types';
import {GetBooksResponse, GetPurchasedResponse} from '@redux/types';

export const getUserInfo = async () => {
  try {
    const {data} = await callApi().get(EndPoint.account_details);
    if (data) {
      return data as User;
    } else {
      return null;
    }
  } catch (error) {
    console.log('getUserInfo err', error);
    return null;
  }
};

export const getContentBook = async (bookId: string) => {
  try {
    const res = await callApi().get<BookContentResponse>(
      `/books/${bookId}/readtn`,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('getContentBook error: ', error.response?.data);
    } else {
      console.log('getContentBook unexpected error: ', error);
    }
  }
};

export const addPaymentMethod = async (request: AddPaymentMethodRequest) => {
  try {
    const res = await callApi().post(EndPoint.addPaymentMethod, {
      ...request,
    });
    return res.data._id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('addPaymentMethod error: ', error.response?.data);
    } else {
      console.log('addPaymentMethod unexpected error: ', error);
    }
    return '';
  }
};

export const getAllPaymentMethod = async () => {
  try {
    const res = await callApi().get<PaymentMethod[]>(
      EndPoint.getPaymentMethods,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('getAllPaymentMethod error: ', error.response?.data);
    } else {
      console.log('getAllPaymentMethod unexpected error: ', error);
    }
  }
};

export const purchaseBook = async (
  bookId: string | undefined,
  paymentMethodId: string,
) => {
  try {
    if (!bookId) {
      throw new Error('purchaseBook: bookId undefined');
    }
    const res = await callApi().post(EndPoint.purchase, {
      _bookIds: [bookId],
      _paymentMethodId: paymentMethodId,
    });
    console.log('purchaseBook response', res);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('purchaseBook error: ', error.response?.data);
    } else {
      console.log('purchaseBook unexpected error: ', error);
    }
  }
};

export const getAllPurchasesBook = async () => {
  const res: GetPurchasedResponse = await callApi().get(
    EndPoint.historyPurchase,
  );
  return res;
};

export const updateUserInfo = async (userInfo: User | FormData) => {
  try {
    if (userInfo instanceof FormData) {
      console.log('userInfo is instanceof FormData');
      await callApi('multipart/form-data').post(
        EndPoint.baseUrl + EndPoint.update_account,
        userInfo,
      );
    } else {
      await callApi().post(EndPoint.update_account, userInfo);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('updateUserInfo error: ', error.response?.data);
    } else {
      console.log('updateUserInfo unexpected error: ', error);
    }
  }
};

export const getWishlist = async () => {
  try {
    const responses = await callApi().get(EndPoint.get_wishlist);
    if (responses) {
      return responses.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('getWishlist err', error);
    return null;
  }
};

export const getBooks = async (payload?: IGetBooks) => {
  // const search = payload?.search ? '?search=' + payload?.search : 'null';
  // console.log(search);
  // const uri = EndPoint.searchBooks + '?search&genre&page&sort&asc';
  // const search: React.FC<HeaderSearchScreenProps> =
  // const uri = EndPoint.searchBooks;
  const search = payload?.search
    ? '?search=' + payload?.search
    : '' + '&limit=10&page=' + (payload?.page || 1);
  const uri = EndPoint.searchBooks + search;
  // console.log(uri);
  const data: GetBooksResponse = await callApi().get(uri);
  return data;
};

export const getAllGenres = async () => {
  try {
    const {data} = await callApi().get(EndPoint.getAllGenre);
    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('getAllGenre error', error);
    return null;
  }
};

export const getDetailBook = async (bookId: string) => {
  try {
    const {data} = await callApi().get('/books/' + bookId + '/details');
    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('getDetailBook error', error);
    return null;
  }
};

export const readDetailBook = async (
  bookId: string,
  page: number,
  chapter?: 'chapter' | 'page',
) => {
  const {data, config} = await callApi().get('/books/' + bookId + '/read');
  if (data) {
    return data;
  } else {
    return null;
  }
};

export const AddPaymentMethod = async (payMentThod: {}) => {
  try {
    await callApi().post(EndPoint.addpayMentThod, {
      ...payMentThod,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('addPaymentThod error: ', error.response?.data);
    } else {
      console.log('addPaymentThod unexpected error: ', error);
    }
  }
};
export const getPaymentMethod = async () => {
  try {
    const responses = await callApi().get(EndPoint.getpayMentThod);
    if (responses) {
      return responses.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('getPayment err', error);
    return null;
  }
};

export const deletePayMentThod = async (id: string) => {
  const {status} = await callApi().delete(EndPoint.deletePayMentThod, {
    data: {
      _id: id,
    },
  });
  return status === 200;
};

export const addWishlist = async (bookId: string) => {
  try {
    const {data} = await callApi().get('/books/' + bookId + '/addWishlist');
    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('getDetailBook error', error);
    return null;
  }
};

export const removeWishlist = async (bookId: string) => {
  try {
    const {data} = await callApi().get('/books/' + bookId + '/removeWishlist');
    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('getDetailBook error', error);
    return null;
  }
};

// get all comment
export const getAllComment = async (bookId: string) => {
  try {
    const res: CommmentResponse = await callApi().get(
      `/ratings/${bookId}/getAll`,
    );
    if (res) {
      return res;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('getAllComment error: ', error.response?.data);
    } else {
      console.log('getAllComment unexpected error: ', error);
    }
  }
};

export const getHistoryPurchase = async () => {
  try {
    const {data} = await callApi().get(EndPoint.historyPurchase);
    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('getHistoryPurchase err', error);
    return null;
  }
};

export const UpdatePassword = async (password: {}) => {
  try {
    await callApi().post(EndPoint.updatePassword, {
      ...password,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('updatePassword error: ', error.response?.data);
    } else {
      console.log('updatePassword unexpected error: ', error);
    }
  }
};

export const createReview = async function (
  ebookId: string,
  ratings?: number,
  comment?: string,
) {
  try {
    await callApi().post(`/ratings/${ebookId}/create`, {
      rating: ratings,
      comment: comment,
    });
  } catch (error) {
    console.log('createReview error' + error);
  }
};

export const updateReview = async function (
  ebookId: string,
  ratings: number,
  comment?: string,
) {
  try {
    await callApi().post(`/ratings/${ebookId}/update`, {
      rating: ratings,
      comment: comment,
    });
  } catch (error) {
    console.log('updateReview error' + error);
  }
};

export const getMyReview = async function (ebookId: string) {
  try {
    const {data} = await callApi().get(`/ratings/${ebookId}/mine`);
    if (data) {
      return data;
    }
    return null;
  } catch (error) {
    return null;
  }
};
