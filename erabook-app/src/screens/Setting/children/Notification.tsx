import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {useTranslation} from 'react-i18next';
import {
  AccountScreenTranslationKey,
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import PushNotification, {Importance} from 'react-native-push-notification';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SwitchNotification} from '../components/SwitchNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderComponents from '../components/HeaderComponents';

const Notification: React.FC = () => {
    const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);
  const {t: translate1} = useTranslation(RoutesTranslationKey.accountRoute);

  const [isBedtimePickerVisible, setIsBedtimePickerVisible] = useState(false);
  const [isReadingTimePickerVisible, setIsReadingTimePickerVisible] =
    useState(false);
  const [bedtime, setBedtime] = useState(new Date());
  const [readingTime, setReadingTime] = useState(new Date());

  const showBedtimePicker = () => setIsBedtimePickerVisible(true);
  const hideBedtimePicker = () => setIsBedtimePickerVisible(false);
  const handleBedtimeConfirm = (date: Date) => {
    setBedtime(date);
    hideBedtimePicker();
    checkAndScheduleNotification(date, 'It is time to go to bed!');
  };

  const handleReadingTimeConfirm = (date: Date) => {
    setReadingTime(date);
    hideReadingTimePicker();
    checkAndScheduleNotification(date, 'It is time to read your book!');
  };

  const showReadingTimePicker = () => setIsReadingTimePickerVisible(true);
  const hideReadingTimePicker = () => setIsReadingTimePickerVisible(false);

  const cancelCustomNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  useEffect(() => {
    const loadSwitchState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('switchState');
        if (savedState !== null) {
          setIsEnabled(JSON.parse(savedState));
          handleEnableAppSystemNotifications(JSON.parse(savedState));
              }
            } catch (error) {
        console.error('Error loading switch state:', error);
      }
      };
        loadSwitchState();
  }, []);
   const handleEnableAppSystemNotifications = (value: boolean) => {
    if (value) {
      console.log('App system notifications enabled');
    } else {
      cancelCustomNotifications();
      setIsBedtimePickerVisible(false); // Ẩn picker khi SwitchNotification tắt
      setIsReadingTimePickerVisible(false);
      console.log('App system notifications disabled');
    }

    AsyncStorage.setItem('switchState', JSON.stringify(value)).catch(error => {
      console.error('Error saving switch state:', error);
    });
  };

  // Function to schedule a notification
  const scheduleNotification = (message: string) => {
    PushNotification.localNotification({
      channelId: 'custom-notification-channel',
      message: message,
      allowWhileIdle: true,
    });
  };

  // Hàm kiểm tra và lên lịch thông báo
  const checkAndScheduleNotification = (
    selectedTime: Date,
    message: string,
  ) => {
    const currentTime = new Date();
    if (selectedTime > currentTime) {
      const timeDiff = selectedTime.getTime() - currentTime.getTime();
      setTimeout(() => {
        scheduleNotification(message);
      }, timeDiff);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponents
        title={translate1(AccountScreenTranslationKey.Notification)}
      />
      <View style={{paddingHorizontal: 16}}>
        <Text style={styles.txtContent}>
          {translate(OtherTranslationKey.Notifymewhen)}
        </Text>
        <TouchableOpacity onPress={showBedtimePicker}>
          <Text style={styles.txtContent}>
            Select Bedtime: {bedtime.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
        {isEnabled && isBedtimePickerVisible && (
          <DateTimePicker
            mode="time"
            value={bedtime}
            onChange={(event, date) => handleBedtimeConfirm(date || new Date())}
          />
        )}
        <TouchableOpacity onPress={showReadingTimePicker}>
          <Text style={styles.txtContent}>
            Select Reading Time: {readingTime.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>

        {isEnabled && isReadingTimePickerVisible && (
          <DateTimePicker
            mode="time"
            value={readingTime}
            onChange={(event, date) =>
              handleReadingTimeConfirm(date || new Date())
            }
          />
        )}
        <SwitchNotification
          title={translate(OtherTranslationKey.EnableAppSystemNotifications)}
          isEnabled={isEnabled}
          onValueChange={val => {
            setIsEnabled(val);
            handleEnableAppSystemNotifications(val);
          }}
        />
      </View>
    </View>
  );
};
const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
      container: {
            flex: 1,
      backgroundColor: colors.background,
      },
      txtContent: {
            fontFamily: 'Popins', // Assuming 'Popins' is a valid font family
      color: colors.text,
      fontSize: 16,
      paddingVertical: 24,
      },
        });

export default Notification;