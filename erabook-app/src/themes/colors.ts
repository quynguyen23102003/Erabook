import {AppThemeColors} from './theme.config';
import {DefaultTheme} from 'react-native-paper';

export const lightColors: AppThemeColors = {
  ...DefaultTheme.colors,
  primary: '#F89300',
  secondary: '#FEF4E6',
  white: '#FFFFFF',
  black: '#000000',
  text: '#212121',
  border: '#f2f2f2', // màu viền
  googleButton: '#fafafa', //màu nền button google
  textSecondary: '#F89300', // mauf chữ của những button có màu nền secondary
  background: '#FFFFFF', //màu nền backgroundColor
  gray: '#616161',
  textItem: '#686868',
  backgroundInputSearch: '#f5f5f5',
  textDescription: '#212121',
  backgroundCategory: '#eeeeee',
  backgroundSwitch: '#efefef',
  textTab: '#9e9e9e',
  red: '#B80000',
};

export const darkColors: AppThemeColors = {
  ...DefaultTheme.colors,
  primary: '#F89300',
  secondary: '#35383F',
  white: '#181A20',
  black: '#FFFFFF',
  text: '#FFFFFF',
  border: '#2b2e34',
  textSecondary: '#FFFFFF',
  background: '#181a20',
  googleButton: '#1f222a',
  gray: '#9a9b9d',
  textItem: '#FFFFFF',
  backgroundInputSearch: '#1f222a',
  textDescription: '#e0e0e0',
  backgroundCategory: '#35383f',
  backgroundSwitch: '#35373e',
  textTab: '#58595c',
  red: '#B80000',
};
