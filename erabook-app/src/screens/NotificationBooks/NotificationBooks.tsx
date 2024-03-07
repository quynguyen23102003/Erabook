import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Appearance } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { Popins } from '../../components/popins'
import NotifiItemBook from '../../components/Item/NotificationItemBooks'
import HeaderNotification from './HeaderNotification'
import { AppThemeColors, useAppTheme } from 'themes/theme.config'
import { useTranslation } from 'react-i18next'
import { OtherTranslationKey, RoutesTranslationKey } from 'translations/constants'
import { ThemeKey } from '@redux/slice/setting.slice'
import { useAppSelector } from '@redux/storeAndStorage/persist'
import PushNotification, { Importance } from 'react-native-push-notification';
import { getAllPaymentMethod } from '@services/api.service';
import DeviceInfo from 'react-native-device-info';
import { Notification } from '@assets/Icon';
import BackgroundTimer from 'react-native-background-timer';

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

const initialDataNotification: TOptionsSetting[] = [
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

const NotificationBooks: React.FC = () => {
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const currentTheme = useAppSelector((state) => state.root.setting.themeColor);
  const colorScheme = Appearance.getColorScheme();
  const handleColorScheme = useCallback(
    (bgLight: string, bgDark: string, iconLight: string, iconDark: string) => {
      switch (currentTheme) {
        case ThemeKey.Dark:
          return {
            icon: iconDark,
            bg: bgDark,
          };
        case ThemeKey.Light:
          return {
            icon: iconLight,
            bg: bgLight,
          };
        case ThemeKey.SystemDefault:
          return colorScheme === 'light'
            ? {
              icon: iconLight,
              bg: bgLight,
            }
            : {
              icon: iconDark,
              bg: bgDark,
            };
      }
    },
    [colorScheme, currentTheme]
  );

  const checkStorageStatus = async () => {
    try {
      const deviceTotalSpace = await DeviceInfo.getTotalDiskCapacity(); // Tổng dung lượng của thiết bị
      const deviceFreeSpace = await DeviceInfo.getFreeDiskStorage(); // Dung lượng trống còn lại trên thiết bị

      // Chia tỉ lệ dung lượng còn lại trên tổng dung lượng
      const freeSpaceRatio = deviceFreeSpace / deviceTotalSpace;

      // Chọn một ngưỡng dựa trên yêu cầu của bạn, ví dụ: 10% trở lên là bộ nhớ đầy
      const threshold = 0.1;

      // Kiểm tra xem bộ nhớ có đầy không
      const isStorageAlmostFull = freeSpaceRatio <= threshold;

      return isStorageAlmostFull;
    } catch (error) {
      console.error('Error checking storage status:', error);
      return false; // Trả về false nếu có lỗi
    }
  };

  const [dataNotification, setDataNotification] = useState(initialDataNotification);
  const checkAndUpdateData = async () => {
    try {
      const paymentMethods = await getAllPaymentMethod();

      if (paymentMethods !== undefined && paymentMethods.length !== undefined && paymentMethods.length > 0) {
        const connectedCardNotification = {
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
        };

        setDataNotification((prevData) => [...prevData, connectedCardNotification]);
      }
      if (paymentMethods !== undefined && paymentMethods.length !== undefined && paymentMethods.length >= 1) {
        const multipleCardNotification = {
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
        };

        setDataNotification((prevData) => [...prevData, multipleCardNotification]);
      }

      // Kiểm tra nếu bộ nhớ đầy, thêm dòng thông báo về bộ nhớ đầy
      const isStorageAlmostFull = await checkStorageStatus();

      if (isStorageAlmostFull) {
        const storageFullNotification = {
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
        };

        setDataNotification((prevData) => [...prevData, storageFullNotification]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    checkAndUpdateData();
  }, []);

 
  return (
    <ScrollView style={styles.container}>
      <HeaderNotification />
      <View>
        {dataNotification && dataNotification.length > 0 ? (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}>
            {dataNotification.map((item, index) => (
              <NotifiItemBook
                key={index}
                backgroundColor={handleColorScheme(item.bgLightColor, item.bgDarkColor, item.iconLightColor, item.iconDarkColor).bg}
                iconColor={handleColorScheme(item.bgLightColor, item.bgDarkColor, item.iconLightColor, item.iconDarkColor).icon}
                {...item}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.content}>
            <Image style={{ width: 82, height: 82 }} source={require('../../assets/icon/main/main-icon.png')} />
            <Text style={styles.title}>{translate(OtherTranslationKey.Empty)}</Text>
            <Text style={styles.description}>{translate(OtherTranslationKey.You)}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default NotificationBooks;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '50%',
    },
    title: {
      marginVertical: 10,
      color: colors.text,
      fontFamily: Popins[700],
      fontSize: 16,
    },
    description: {
      color: colors.textDescription,
      fontFamily: Popins[400],
      fontSize: 14,
    },
  });