import {
  Appearance,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {
  OptionsSettingScreen,
  SettingIdType,
  TOptionsSetting,
} from './components/options';
import {SettingItemMeno} from './components/SettingItem';
import {RootStackName, RootStackProps} from '@navigator/types';
import {useAppDispatch, useAppSelector} from '@redux/storeAndStorage/persist';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {
  AccountScreenTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import {bottomSheet, BottomSheetName} from '@redux/slice/bottomsheet.slice';
import {setIsLoading, setLogin} from '@redux/slice/app.slice';
import {signOut} from '@services/auth.service';
import {removeUserData} from '@redux/slice/user.slice';
import {ThemeKey} from '@redux/slice/setting.slice';
import {Popins} from '@components/popins';
import {AppHeader} from '@components/AppHeader';
import {Button, Dialog, Portal} from 'react-native-paper';

const Account: React.FC = () => {
  const navigation = useNavigation<RootStackProps>();
  const user = useAppSelector(state => state.root.user.userInfo);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const {t} = useTranslation(RoutesTranslationKey.accountRoute);
  const currentTheme = useAppSelector(state => state.root.setting.themeColor);
  const colorScheme = Appearance.getColorScheme();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const changeMode = () => {
    dispatch(
      bottomSheet({
        name: BottomSheetName.ChangeTheme,
        status: true,
      }),
    );
  };

  const showDialogLogout = () => setLogoutDialogVisible(true);

  const hideDialogLogout = () => setLogoutDialogVisible(false);

  const handleLogout = () => {
    hideDialogLogout();
    dispatch(setIsLoading(true));
    setTimeout(() => {
      const logout = signOut();
      if (logout) {
        dispatch(removeUserData());
        navigation.reset({
          index: 1,
          routes: [{name: RootStackName.LoginNavigator}],
        });
      }
      dispatch(setLogin(false));
      dispatch(setIsLoading(false));
    }, 1000);
  };

  const onPress = (item: TOptionsSetting) => {
    switch (item.id) {
      case SettingIdType.darkMode:
        changeMode();
        break;
      case SettingIdType.logout:
        showDialogLogout();
        break;
      case SettingIdType.payment:
        navigation.navigate(RootStackName.PaymentMenthodsScreen);
        break;
      case SettingIdType.notification:
        navigation.navigate(RootStackName.NotificationSettingScreen);
        break;
      case SettingIdType.personalInfo:
        navigation.navigate(RootStackName.PersonalInfo);
        break;
      case SettingIdType.aboutErabook:
        navigation.navigate(RootStackName.AboutBookSettingScreen);
        break;
      case SettingIdType.helpCenter:
        navigation.navigate(RootStackName.HelpCenterScreen);
        break;
      case SettingIdType.language:
        navigation.navigate(RootStackName.languageSettingScreen);
        break;
      case SettingIdType.preferences:
        navigation.navigate(RootStackName.PreferencesSettingScreen);
        break;
      case SettingIdType.security:
        navigation.navigate(RootStackName.SecuritySettingScreen);
        break;
    }
  };

  const renderCurrentTheme = useMemo(() => {
    return (
      <View>
        <Text style={styles.big_text}>{t(currentTheme)}</Text>
      </View>
    );
  }, [currentTheme, styles.big_text, t]);

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
    [colorScheme, currentTheme],
  );
  return (
    <View style={styles.container}>
      <Portal>
        <Dialog
          style={{backgroundColor: colors.background}}
          visible={logoutDialogVisible}
          onDismiss={hideDialogLogout}>
          <Dialog.Title
            style={{
              color: colors.text,
              fontSize: 20,
              fontFamily: Popins['500'],
            }}>
            {t(AccountScreenTranslationKey.Logout)}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{color: colors.text, fontFamily: Popins['400']}}>
              {t(AccountScreenTranslationKey.AreYouSure)}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={colors.gray}
              labelStyle={{fontFamily: Popins['400']}}
              onPress={hideDialogLogout}>
              {t(AccountScreenTranslationKey.Cancel)}
            </Button>
            <Button
              labelStyle={{fontFamily: Popins['400']}}
              onPress={handleLogout}>
              {t(AccountScreenTranslationKey.Logout)}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <AppHeader icon title={t(AccountScreenTranslationKey.Account)} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 12,
          paddingHorizontal: 16,
        }}
        overScrollMode="never"
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              navigation.navigate(RootStackName.UpdatePersonalInfo);
            }}>
            <View style={styles.line_left}>
              <Image
                style={[
                  styles.image,
                  {marginRight: 10, width: 48, height: 48, padding: 0},
                ]}
                source={{
                  uri:
                    user?.avatarUrl ||
                    `https://ui-avatars.com/api/?font-size=0.35&name=${user?.username}&background=0D8ABC&color=fff&rounded=true&bold=true&size=128`,
                }}
              />
              <View style={{justifyContent: 'center'}}>
                <Text style={[styles.big_text]}>{user?.username}</Text>
                <Text style={styles.small_text}>{user?.emailAddress}</Text>
              </View>
            </View>
            <Icon name="edit" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          {OptionsSettingScreen.payment.map((item, index) => {
            return (
              <SettingItemMeno
                key={index}
                backgroundColor={
                  handleColorScheme(
                    item.bgLightColor,
                    item.bgDarkColor,
                    item.iconLightColor,
                    item.iconDarkColor,
                  ).bg
                }
                iconColor={
                  handleColorScheme(
                    item.bgLightColor,
                    item.bgDarkColor,
                    item.iconLightColor,
                    item.iconDarkColor,
                  ).icon
                }
                onPress={() => onPress(item)}
                {...item}
              />
            );
          })}
        </View>
        <View style={styles.section}>
          {OptionsSettingScreen.account.map((item, index) => {
            return (
              <SettingItemMeno
                key={index}
                backgroundColor={
                  handleColorScheme(
                    item.bgLightColor,
                    item.bgDarkColor,
                    item.iconLightColor,
                    item.iconDarkColor,
                  ).bg
                }
                iconColor={
                  handleColorScheme(
                    item.bgLightColor,
                    item.bgDarkColor,
                    item.iconLightColor,
                    item.iconDarkColor,
                  ).icon
                }
                onPress={() => onPress(item)}
                actionComponent={
                  item.id === SettingIdType.darkMode && renderCurrentTheme
                }
                {...item}
              />
            );
          })}
        </View>
        <View style={[styles.section, {borderBottomWidth: 0}]}>
          {OptionsSettingScreen.others.map((item, index) => {
            return (
              <SettingItemMeno
                key={index}
                backgroundColor={
                  handleColorScheme(
                    item.bgLightColor,
                    item.bgDarkColor,
                    item.iconLightColor,
                    item.iconDarkColor,
                  ).bg
                }
                iconColor={
                  handleColorScheme(
                    item.bgLightColor,
                    item.bgDarkColor,
                    item.iconLightColor,
                    item.iconDarkColor,
                  ).icon
                }
                actionVisible={item.id !== SettingIdType.logout}
                onPress={() => onPress(item)}
                {...item}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
export default Account;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    section: {
      paddingVertical: 4,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    line: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    line_left: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 48,
      height: 48,
    },
    big_text: {
      fontFamily: Popins['600'],
      // fontStyle: '',
      // fontWeight: '700',
      fontSize: 16,
      color: colors.text,
    },
    small_text: {
      fontFamily: Popins['400'],
      // fontStyle: 'normal',
      // fontWeight: '400',
      fontSize: 14,
      color: colors.text,
    },
    image: {
      width: 24,
      height: 24,
      borderRadius: 31,
      overflow: 'hidden',
    },
    containerImage: {
      borderRadius: 10000,
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
    },
  });
