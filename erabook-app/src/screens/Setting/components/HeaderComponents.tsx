import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { useNavigation } from '@react-navigation/native';
import { RootStackName, RootStackProps } from '@navigator/types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from "react-native-vector-icons/AntDesign";
import { Popins } from '@components/popins';
import { useTranslation } from 'react-i18next';
import { AccountScreenTranslationKey, RoutesTranslationKey } from '@translations/constants';
import { AppHeader, IAppHeaderProps } from '@components/AppHeader';

const HeaderComponents: React.FC<IAppHeaderProps> = ({ title }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<RootStackProps>();
  const { t: translate1 } = useTranslation(RoutesTranslationKey.accountRoute);

  const renderRight = () => {
    return (
      title == translate1(AccountScreenTranslationKey.PersonalInfo) ?
        (
          <TouchableOpacity style={{ flex: 0 }} onPress={() => navigation.navigate(RootStackName.UpdatePersonalInfo)}>
            <Icon3 name="edit" size={23} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ flex: 0 }}>
          </TouchableOpacity>
        )
    );
  };
  const renderLeft = () => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" style={styles.icon} size={24} />
      </TouchableOpacity>
    );
  }


  return (
    <AppHeader
      icon
      LeftComponent={renderLeft}
      RightComponent={renderRight}
      title={title}
    />
  )
}

export default HeaderComponents

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  icon: {
    color: colors.text
  },
  text700: {
    color: colors.text,
    fontFamily: Popins[700],
    fontSize: 20,
    marginLeft: 8
  },
  img: {
    color: colors.text,
    width: 24,
    height: 24,
    marginRight: 20
  }
})