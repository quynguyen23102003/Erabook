import {Notification} from '@assets/Icon';
import {OtherTranslationKey} from '../../translations/constants';

export type TOptionsSetting = {
  id: number;
  title: OtherTranslationKey;
  icon: any;
  bgLightColor: string;
  iconLightColor: string;
  bgDarkColor: string;
  iconDarkColor: string;
  date: string;
  time: string;
  description: OtherTranslationKey;
  isNew: boolean;
};

export const OptionsNotificationScreen: TOptionsSetting[] = [
  {
    id: 1,
    title: OtherTranslationKey.SecurityUpdates,
    icon: Notification.security,
    bgLightColor: 'rgba(81, 138, 254, 0.1)',
    iconLightColor: '#4372d0',
    bgDarkColor: 'rgba(81, 138, 254, 0.1)',
    iconDarkColor: '#518afe',
    date: 'Today',
    time: '09:24 AM',
    description: OtherTranslationKey.NowErabookhasaTwo,
    isNew: true,
  },
  {
    id: 2,
    title: OtherTranslationKey.MultipleCardFeatures,
    icon: Notification.Multiple,
    bgLightColor: 'rgba(251, 165, 38, 0.1)',
    iconLightColor: '#e19422',
    bgDarkColor: 'rgba(251, 165, 38, 0.1)',
    iconDarkColor: '#FF9F0A',
    date: '1 day ago',
    time: '14:43 PM',
    description: OtherTranslationKey.NowyoucanalsoconnectErabookwithmultipleMasterCard,
    isNew: true,
  },
  {
    id: 3,
    title: OtherTranslationKey.NewUpdatesAvailable,
    icon: Notification.New,
    bgLightColor: 'rgba(115, 85, 255, 0.1)',
    iconLightColor: '#654cde',
    bgDarkColor: 'rgba(115, 85, 255, 0.1)',
    iconDarkColor: '#7355ff',
    date: '2 days ago',
    time: '10:29 AM',
    description: OtherTranslationKey.UpdateErabooknowtogetaccesstothelatestfeaturesforeasierinbuyingebook,
    isNew: false,
  },
  {
    id: 4,
    title: OtherTranslationKey.YourStorageisAlmostfull,
    icon: Notification.Your,
    bgLightColor: 'rgba(255, 110, 119, 0.1)',
    iconLightColor: '#da5d65',
    bgDarkColor: 'rgba(255, 110, 119, 0.1)',
    iconDarkColor: '#ff6e77',
    date: '5 days ago',
    time: '16:52 PM',
    description: OtherTranslationKey.YourstorageisalmostfullDeletesomeitemstomakemorespace,
    isNew: false,
  },
  {
    id: 5,
    title: OtherTranslationKey.CreditCardConnected,
    icon: Notification.Credit,
    bgLightColor: 'rgba(115, 85, 255, 0.1)',
    iconLightColor: '#654cde',
    bgDarkColor: 'rgba(115, 85, 255, 0.1)',
    iconDarkColor: '#7355ff',
    date: '6 days ago',
    time: '15:38 PM',
    description: OtherTranslationKey.YourcreditcardhasbeensuccessfullylinkedwithErabookEnjoyourservices,
    isNew: false,
  },
  {
    id: 6,
    title: OtherTranslationKey.AccountSetupSuccessful,
    icon: Notification.Account,
    bgLightColor: 'rgba(66, 218, 165, 0.1)',
    iconLightColor: '#31ab82',
    bgDarkColor: 'rgba(66, 218, 165, 0.1)',
    iconDarkColor: '#42daa5',
    date: '12 Dec, 2022',
    time: '14:27 PM',
    description: OtherTranslationKey.Youraccountcreationissuccessfulyoucannowexperienceourservices,
    isNew: false,
  },
];
