import {StyleSheet} from 'react-native';
import {AppThemeColors} from '../../../../themes/theme.config';
import {Popins} from '../../../../components/popins';

export const useStyle = (colors: AppThemeColors) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    text500: {
      color: colors.text,
      fontFamily: Popins[500],
      top: 2,
    },
    text700: {
      color: colors.text,
      fontFamily: Popins[700],
      top: 2.1,
    },
    footer: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderBottomColor: colors.backgroundCategory,
      paddingBottom: 10,
      marginTop: 10,
      marginBottom: 15,
      marginHorizontal: 24
    },
    footercontent: {
      alignItems: 'center',
    },
    footercontent1: {
      flex: 1,
      marginStart: 13,
      marginTop: 17,
    },
    viewpaper: {
      flexDirection: 'row',
      flex: 1,
    },
    paper: {
      marginTop: 7,
      marginStart: 5,
      width: 190,
      borderRadius: 5,
    },
    txtReviewText: {
      color: colors.primary,
      fontFamily: Popins[500],
      fontSize: 17,
      alignSelf: 'center',
      marginLeft: 10,
      top: 2,
    },
    horizontalLine: {
      height: 2,
      width: 320,
      backgroundColor: colors.white,
      alignSelf: 'center',
      marginTop: 20,
    },
    button: {
      borderWidth: 2,
      borderColor: colors.primary,
      paddingHorizontal: 14,
      borderRadius: 30,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    txtReviewIcon: {
      color: colors.primary,
      fontFamily: Popins[700],
      fontSize: 17,
      alignItems: 'center',
      marginRight: 5,
    },
  });

export default useStyle;
