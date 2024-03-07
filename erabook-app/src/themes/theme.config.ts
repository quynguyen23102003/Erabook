import {DefaultTheme as PaperDefaultTheme, useTheme} from 'react-native-paper';
import {darkColors, lightColors} from './colors';

export type CustomColors = {
  primary: string;
  secondary: string;
  white: string;
  black: string;
  text: string;
  textSecondary: string;
  background: string;
  googleButton: string;
  border: string;
  gray: string;
  textItem: string;
  backgroundInputSearch: string;
  textDescription: string;
  backgroundCategory: string;
  backgroundSwitch: string;
  textTab: string;
  placeholder: string;
  red: string;
};

export type AppThemeColors = CustomColors;

export type AppTheme = {
  colors: AppThemeColors;
};

export const lightTheme: AppTheme = {
  ...PaperDefaultTheme,
  colors: lightColors,
};

export const darkTheme: AppTheme = {
  ...PaperDefaultTheme,
  colors: darkColors,
};

export const useAppTheme = () => useTheme<AppTheme>();
