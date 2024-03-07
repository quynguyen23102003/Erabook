import { ActivityIndicator, Alert, Appearance, Button, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { darkTheme, lightTheme } from './src/themes/theme.config';
import { PaperProvider } from 'react-native-paper';
import { persistor, store, useAppDispatch, useAppSelector } from './src/redux/storeAndStorage/persist';
import { PersistGate } from 'redux-persist/integration/react';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigator/RootNavigator';
import { AppDialog } from './src/components/dialog/AppDialog';
import { ChangeThemesBottomSheet } from './src/screens/Setting/components/ChangeThemsBottomSheet';
import { ThemeKey } from './src/redux/slice/setting.slice';
import PushNotification, { Importance } from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackPlayerBottomSheet } from '@components/TrackPlayer';
import { toggleBottomSheet } from '@redux/slice/track.slice';

const RootScreen = () => {
  const { setting } = useAppSelector(state => state.root);
  const {
    isLoading,
    tokens: { isError },
  } = useAppSelector(state => state.root.app);
  const colorScheme = Appearance.getColorScheme();
  const handleThemeColor = useCallback(() => {
    switch (setting.themeColor) {
      case ThemeKey.Dark:
        return darkTheme;
      case ThemeKey.Light:
        return lightTheme;
      default:
        return colorScheme === 'dark' ? darkTheme : lightTheme;
    }
  }, [colorScheme, setting.themeColor]);

  function timeUntilNextMinute() {
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();
    return secondsUntilNextMinute * 1000; // Convert seconds to milliseconds
  }



  useEffect(() => {
    let notificationScheduled = false;
    let isEnabled: string | null = 'false';

    const scheduleNotificationBasedOnTime = async () => {
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();

      // Check if the switch is enabled
      isEnabled = await AsyncStorage.getItem('switchState');

      PushNotification.createChannel(
        {
          channelId: 'custom-notification-channel',
          channelName: 'Custom Notification Channel',
          channelDescription: 'Channel for custom notifications',
          soundName: 'default',
          importance: Importance.HIGH,
          vibrate: true,
        },
        (created) => console.log(`Channel created: ${created}`)
      );

      if (isEnabled === 'true') {
        // Schedule or cancel custom notifications based on the switch state
        if (!notificationScheduled && currentHour === 11 && currentMinute === 24) {
          scheduleNotification("It's time to do something!");
          notificationScheduled = true;
        } else if (!notificationScheduled && currentHour === 7) {
          scheduleNotification("Good morning! It's time to read a book.");
          notificationScheduled = true;
        }
      } else {
        // If the switch is not enabled, cancel all notifications
        PushNotification.cancelAllLocalNotifications();
      }
    };

    // Helper function to calculate the time until the next minute

    // Use setTimeout to delay the initial execution
    const initialTimeoutId = setTimeout(() => {
      scheduleNotificationBasedOnTime();

      // Use setInterval to check every 5 minutes
      const intervalId = BackgroundTimer.setInterval(() => {
        scheduleNotificationBasedOnTime();
      }, 5 * 60 * 1000); // 5 minutes in milliseconds

      // Clean up when the component unmounts
      const cleanup = () => {
        BackgroundTimer.clearInterval(intervalId);
        PushNotification.cancelAllLocalNotifications();
      };

      return cleanup;
    }, timeUntilNextMinute());

    // Also, clear the initial timeout when the component unmounts
    return () => {
      clearTimeout(initialTimeoutId);
    };
  }, []); // Remove [isEnabled] from here



  // Function to schedule a notification
  const scheduleNotification = (message: string) => {
    PushNotification.localNotification({
      channelId: 'custom-notification-channel',
      message: message,
      allowWhileIdle: true,
    });
  };

  return (
    <PaperProvider theme={handleThemeColor()}>
      <MenuProvider>
        <SafeAreaProvider>
          {isLoading && <AppDialog />}
          <StatusBar
            barStyle={
              setting.themeColor === ThemeKey.SystemDefault
                ? colorScheme === 'light'
                  ? 'dark-content'
                  : 'light-content'
                : setting.themeColor === ThemeKey.Light
                  ? 'dark-content'
                  : 'light-content'
            }
            backgroundColor="transparent"
            translucent={true}
          />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
              <RootNavigator />
              <ChangeThemesBottomSheet />
              <TrackPlayerBottomSheet />
            </NavigationContainer>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </MenuProvider>
    </PaperProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootScreen />
      </PersistGate>
    </Provider>
  );
};

export default App;
