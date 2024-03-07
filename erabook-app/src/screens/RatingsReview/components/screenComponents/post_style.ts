import {Dimensions, StyleSheet} from 'react-native';
import {AppThemeColors} from '../../../../themes/theme.config';
import {Popins} from '../../../../components/popins';

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      borderBottomColor: 'gray',
      borderBottomWidth: 0.1,
    },
    content: {
      width: Dimensions.get('window').width, // Đảm bảo rằng nội dung của mỗi trang sẽ có chiều rộng bằng chiều rộng của cửa sổ
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
    },
    userInfo: {
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 100,
    },
    postTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    icon: {
      marginLeft: 10,
      bottom: 35,
    },
    postText: {
      fontSize: 13,
      margin: 10,
      fontFamily: Popins[400],
      left: 8,
      bottom: 8,
      color: colors.text,
    },
    iconBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 15,
    },
    iconsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    likesText: {
      fontFamily: Popins[400],
      fontSize: 14,
      left: 10,
      paddingVertical: 2,
      bottom: 32,
      color: colors.text,
    },
    button: {
      borderWidth: 2,
      borderColor: colors.primary,
      paddingHorizontal: 10,
      borderRadius: 30,
      width: 65,
    },
    txtReviewIcon: {
      color: colors.primary,
      fontFamily: Popins[700],
      fontSize: 17,
      alignItems: 'center',
      marginRight: 5,
    },
    txtReviewText: {
      color: colors.primary,
      fontFamily: Popins[500],
      fontSize: 17,
      alignSelf: 'center',
      marginLeft: 8,
      top: 2,
    },
    timestamp: {
      color: 'gray',
      fontSize: 12,
    },
    timestampContainer: {
      backgroundColor: 'red',
      color: colors.textDescription,
    },
    timestampText: {
      color: colors.text,
      fontSize: 14,
    },
  });

export default useStyle;
