import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {StackScreenProps} from '@react-navigation/stack';

export enum RootStackName {
  SplashScreen = 'SplashScreen',
  LoginNavigator = 'LoginNavigator',
  RootBottomTabs = 'RootBottomTabs',
  TermsAndAgreementScreen = 'TermsAndAgreementScreen',
  PersonalInfo = 'PersonalInfo',
  ChangePassword = 'ChangePassword',
  SearchScreen = 'SearchScreen',
  EbookScreenDetail = 'EbookScreenDetail',
  NotificationScreen = 'NotificationScreen',
  ExploreGenreScreen = 'ExploreGenreScreen',
  EditAccountScreen = 'EditAccountScreen',
  PaymentMenthodsScreen = 'PaymentMenthodsScreen',
  NotificationSettingScreen = 'NotificationSettingScreen',
  SecuritySettingScreen = 'SecuritySettingScreen',
  languageSettingScreen = 'languageSettingScreen',
  PreferencesSettingScreen = 'PreferencesSettingScreen',
  HelpCenterScreen = 'HelpCenterScreen',
  FilterScreen = 'FilterScreen',
  ReadbookScreen = 'ReadbookScreen',
  PaymentScreen = 'PaymentScreen',
  RatingsAndReviewEbookScreen = 'RatingsAndReviewEbookScreen',
  AboutEbookScreen = 'AboutEbookScreen',
  ReviewSumaryScreen = 'ReviewSumaryScreen',
  SelectPaymentMethodScreen = 'SelectPaymentMethodScreen',
  AddNewPaymentScreen = 'AddNewPaymentScreen',
  AboutBookSettingScreen = 'AboutBookSettingScreen',
  UpdatePersonalInfo = 'UpdatePersonalInfo',
  AddPaymentMentthodScreen = 'AddPaymentMentthodScreen',
  WriteAReview = 'WriteAReview',
  GenreScreen = 'GenreScreen',
  DestinationScreen = 'DestinationScreen',
  RecommedForYouScreen = 'RecommedForYouScreen',
  PlayAudioScreen = 'PlayAudioScreen',
  ContactForm = 'ContactForm',
  WhatApps = 'WhatApps',
}

export type RootStackParamList = {
  [RootStackName.SplashScreen]: undefined;
  [RootStackName.LoginNavigator]: undefined;
  [RootStackName.RootBottomTabs]: undefined;
  [RootStackName.TermsAndAgreementScreen]: undefined;
  [RootStackName.PersonalInfo]: undefined;
  [RootStackName.ChangePassword]: undefined;
  [RootStackName.SearchScreen]:
    | {
        genre?: string;
        sort?: string;
        asc?: string;
        filter?: string;
      }
    | undefined;
  [RootStackName.EbookScreenDetail]: {ebookId: string};
  [RootStackName.NotificationScreen]: undefined;
  [RootStackName.ExploreGenreScreen]: undefined;
  [RootStackName.EditAccountScreen]: undefined;
  [RootStackName.PaymentMenthodsScreen]: undefined;
  [RootStackName.NotificationSettingScreen]: undefined;
  [RootStackName.SecuritySettingScreen]: undefined;
  [RootStackName.languageSettingScreen]: undefined;
  [RootStackName.PreferencesSettingScreen]: undefined;
  [RootStackName.HelpCenterScreen]: undefined;
  [RootStackName.FilterScreen]: undefined;
  [RootStackName.ReadbookScreen]: {ebookId: string};
  [RootStackName.RatingsAndReviewEbookScreen]: {
    bookId: string;
    rating: TBookRating;
  };
  [RootStackName.AboutEbookScreen]: IBook | undefined;
  [RootStackName.ReviewSumaryScreen]: {
    bankName: string;
    cardNumber: string;
    paymentId: string;
  };
  [RootStackName.AddNewPaymentScreen]: undefined;
  [RootStackName.SelectPaymentMethodScreen]: undefined;
  [RootStackName.AboutBookSettingScreen]: undefined;
  [RootStackName.UpdatePersonalInfo]: undefined;
  [RootStackName.AddPaymentMentthodScreen]: undefined;
  [RootStackName.WriteAReview]: {
    rating: number;
    comment?: string;
    bookId?: string;
  };
  [RootStackName.GenreScreen]: {id: string; title: string};
  [RootStackName.DestinationScreen]: {title: string; dataKey: string};
  [RootStackName.RecommedForYouScreen]: undefined;
  [RootStackName.PlayAudioScreen]: {item: AudioFile, index: number};
  [RootStackName.ContactForm]: undefined;
  [RootStackName.WhatApps]: undefined;
};

export enum LoginStackName {
  WelcomeScreen = 'WelcomeScreen',
  SignInScreen = 'SignInScreen',
  SignUpScreen = 'SignUpScreen',
  CreatePassword = 'CreatePassword',
  ForgotPassword = 'ForgotPassword',
  OTPCodeVerification = 'OTPCodeVerification',
}

export type LoginStackParamList = {
  [LoginStackName.WelcomeScreen]: undefined;
  [LoginStackName.SignInScreen]: undefined;
  [LoginStackName.SignUpScreen]: undefined;
  [LoginStackName.CreatePassword]: {
    emailAddress: string;
    code: string;
  };
  [LoginStackName.ForgotPassword]: undefined;
  [LoginStackName.OTPCodeVerification]: {
    emailAddress: string;
  };
};

export enum RootBottomTabsStackName {
  HomeBottomTabScreen = 'HomeBottomTabScreen',
  DiscoverBottomTabScreen = 'DiscoverBottomTabScreen',
  WishlistBottomTabScreen = 'WishlistBottomTabScreen',
  PurchasedBottomTabScreen = 'PurchasedBottomTabScreen',
  AccountBottomTabScreen = 'AccountBottomTabScreen',
}

export type RootBottomTabsParamList = {
  [RootBottomTabsStackName.HomeBottomTabScreen]: {id: string; title: string};
  [RootBottomTabsStackName.DiscoverBottomTabScreen]: undefined;
  [RootBottomTabsStackName.WishlistBottomTabScreen]: undefined;
  [RootBottomTabsStackName.PurchasedBottomTabScreen]: undefined;
  [RootBottomTabsStackName.AccountBottomTabScreen]: undefined;
};

export type DiscoverBottomTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<
    RootBottomTabsParamList,
    RootBottomTabsStackName.DiscoverBottomTabScreen
  >,
  StackScreenProps<RootStackParamList>
>;

export type OTPCodeVerificationScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  LoginStackName.OTPCodeVerification
>;

export type CreatePasswordScreenProps = NativeStackScreenProps<
  LoginStackParamList,
  LoginStackName.CreatePassword
>;

export type AddNewPaymentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  RootStackName.AddNewPaymentScreen
>;

export type WriteAReviewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  RootStackName.WriteAReview
>;
export type RootStackProps = NativeStackNavigationProp<RootStackParamList>;
export type LoginStackProps = NativeStackNavigationProp<LoginStackParamList>;
export type HomeBottomTabsProps =
  NativeStackNavigationProp<RootBottomTabsParamList>;
