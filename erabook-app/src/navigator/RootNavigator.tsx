import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { RootStackName, RootStackParamList } from './types';
import { RootBottomTabs } from './RootBottomTabs';
import { LoginNavigator } from './LoginNavigator';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SplashScreen } from '@screens/SplashScreen/SplashScreen';
import { TermsAndAgreementScreen } from '@screens/Authentication/TermsAndAgreementScreen';
import { ArtDesignIcons } from '@utils/utils';
import PersonalInfo from '@screens/Setting/children/PersonalInfo';
import ChangePassword from '@screens/Setting/children/ChangePassword';
import { SearchScreen } from '@screens/Search/SearchScreen';
import DetailScreen from '@screens/Detail/DetailScreen';
import NotificationBooks from '@screens/NotificationBooks/NotificationBooks';
import ExploreGenreScreen from '@screens/Genre/ExploreGenreScreen';
import PaymentMenthodsScreen from '@screens/Setting/children/PaymentMenthodsScreen';
import Notification from '@screens/Setting/children/Notification';
import { Security } from '@screens/Setting/children/Security';
import Preferences from '@screens/Setting/children/Preferences';
import ReadBookScreen from '@screens/ReadBook/ReadbookScreen';
import AboutThisBook from '@screens/AboutThisBook/AboutThisBook';
import AboutBookSetting from '@screens/Setting/children/AboutBookSetting';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UpdatePersonalInfo from '@screens/Setting/children/UpdatePersonalInfo';
import { cardBottomSheetStyleOptions, defaultOptions } from '@navigator/options';
import AddNewPaymentScreen from '@screens/PurchaseEbook/AddNewPaymentScreen';
import SelectPaymentMethodScreen from '@screens/PurchaseEbook/SelectPaymentMethodScreen';
import ReviewSummaryScreen from '@screens/PurchaseEbook/ReviewSummaryScreen';
// import AddPaymentMentthodScreen from '@screens/Setting/children/AddPaymentMentthodScreen';
import LanguageSetting from '@screens/Setting/children/LanguageSetting';
import HelpCenter from '@screens/Setting/children/HelpCenter';
import AddPaymentMentthodScreen from '@screens/Setting/children/AddPaymentMentthodScreen';
import RatingsAndReviewEbookScreen from '@screens/RatingsReview/RatingsAndReviewEbookScreen';
import WriteAReviewScreen from '@screens/RatingsReview/WriteAReviewScreen';
import FilterScreen from '@screens/Filter/FilterScreen';
import GenreScreen from '@screens/Genre/GenreScreen';
import DestinationScreen from '@screens/Discover/DestinationScreen';
import RecommendForYouScreen from '@screens/Home/RecommendForYouScreen';
import { PlayAudioScreen } from '@screens/PlayList';
import ContactForm from '@screens/ContactUs/ContactForm';
import WhatsApps from '@screens/ContactUs/WhatApps';

const RootStack = createStackNavigator<RootStackParamList>();
export const RootNavigator = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
      }}>
      <RootStack.Screen
        name={RootStackName.SplashScreen}
        component={SplashScreen}
      />
      <RootStack.Screen
        name={RootStackName.LoginNavigator}
        component={LoginNavigator}
      />
      <RootStack.Screen
        name={RootStackName.RootBottomTabs}
        component={RootBottomTabs}
      />
      <RootStack.Screen
        name={RootStackName.TermsAndAgreementScreen}
        component={TermsAndAgreementScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          headerShown: true,
          title: '',
          headerLeft: props => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{ marginHorizontal: 24 }}>
                <ArtDesignIcons name="caretup" size={24} color={'#000'} />
              </TouchableOpacity>
            );
          },
        }}
      />
      <RootStack.Screen
        name={RootStackName.PersonalInfo}
        component={PersonalInfo}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.ChangePassword}
        component={ChangePassword}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.SearchScreen}
        component={SearchScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.EbookScreenDetail}
        component={DetailScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.NotificationScreen}
        component={NotificationBooks}
      />
      <RootStack.Screen
        name={RootStackName.ExploreGenreScreen}
        component={ExploreGenreScreen}
      />
      <RootStack.Screen
        name={RootStackName.EditAccountScreen}
        component={PersonalInfo}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.PaymentMenthodsScreen}
        component={PaymentMenthodsScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.NotificationSettingScreen}
        component={Notification}
      />
      <RootStack.Screen
        name={RootStackName.SecuritySettingScreen}
        component={Security}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.PreferencesSettingScreen}
        component={Preferences}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.ReadbookScreen}
        component={ReadBookScreen}
      />
      <RootStack.Screen
        name={RootStackName.RatingsAndReviewEbookScreen}
        component={RatingsAndReviewEbookScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.AboutEbookScreen}
        component={AboutThisBook}
        options={cardBottomSheetStyleOptions}
      />
      <RootStack.Screen
        name={RootStackName.AboutBookSettingScreen}
        component={AboutBookSetting}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.UpdatePersonalInfo}
        component={UpdatePersonalInfo}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.SelectPaymentMethodScreen}
        component={SelectPaymentMethodScreen}
        options={defaultOptions}
      />

      <RootStack.Screen
        name={RootStackName.ReviewSumaryScreen}
        component={ReviewSummaryScreen}
        options={defaultOptions}
      />

      <RootStack.Screen
        name={RootStackName.AddNewPaymentScreen}
        component={AddNewPaymentScreen}
        options={defaultOptions}
      />
      {/* name={RootStackName.AddPaymeenScreen}
        component={AddPaymentMentthodScreen} /> */}
      <RootStack.Screen
        name={RootStackName.languageSettingScreen}
        component={LanguageSetting}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.HelpCenterScreen}
        component={HelpCenter}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.AddPaymentMentthodScreen}
        component={AddPaymentMentthodScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.WriteAReview}
        component={WriteAReviewScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.FilterScreen}
        component={FilterScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.GenreScreen}
        component={GenreScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.DestinationScreen}
        component={DestinationScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.RecommedForYouScreen}
        component={RecommendForYouScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.PlayAudioScreen}
        component={PlayAudioScreen}
        options={defaultOptions}
      />
      <RootStack.Screen
        name={RootStackName.ContactForm}
        component={ContactForm}
      />
      <RootStack.Screen
        name={RootStackName.WhatApps}
        component={WhatsApps} />
    </RootStack.Navigator>
  );
};
