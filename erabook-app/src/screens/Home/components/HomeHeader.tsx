import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import IconSearch from 'react-native-vector-icons/Feather';
import {RootStackName, RootStackProps} from '@navigator/types';
import {useTranslation} from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {AppHeader} from '@components/AppHeader';
import {useNavigation} from '@react-navigation/native';

const HomeHeader: React.FC = () => {
  const navigation = useNavigation<RootStackProps>();
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const onPressSearch = () => {
    navigation.navigate(RootStackName.SearchScreen);
  };
  const onPressNotificationScreen = () => {
    navigation.navigate(RootStackName.NotificationScreen);
  };
  const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);

  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    setHasNewNotifications(true);
  }, []);

  const renderRight = () => {
    return (
      <View style={{flexDirection: 'row', position: 'relative'}}>
        <TouchableOpacity style={[styles.center]} onPress={onPressSearch}>
          <IconSearch name="search" style={styles.icon} size={22} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.center, {marginLeft: 16}]}
          onPress={onPressNotificationScreen}>
          <IconSearch name="bell" style={styles.icon} size={22} />
          {/* {hasNewNotifications && (
                      <View style={styles.notificationIndicator}></View>
                  )} */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <AppHeader
      icon
      title={translate(OtherTranslationKey.EraBook)}
      RightComponent={renderRight}
    />
  );
};

export default HomeHeader;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      color: colors.text,
    },
    notificationIndicator: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: 'red', // Customize the color as needed
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });
