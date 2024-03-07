// WhatsApps.tsx
import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Communications from 'react-native-communications';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import HeaderComponents from '@screens/Setting/components/HeaderComponents';
import {useTranslation} from 'react-i18next';
import {
  LoginTranslationKey,
  RoutesTranslationKey,
  Step5ScreenTranslationKey,
  OtherTranslationKey,
} from 'translations/constants';

const WhatsApps: React.FC = () => {
  const makePhoneCall = () => {
    const phoneNumber = '0374144696';
    Communications.phonecall(phoneNumber, true);
  };
  const {t: translate} = useTranslation(OtherTranslationKey.WhatApps);
  const {t: translate1} = useTranslation(OtherTranslationKey.Callnow);
  const {t: translate2} = useTranslation(OtherTranslationKey.MayIhelpyou);

  const {colors} = useAppTheme();
  const styles = useStyles(colors);

  useEffect(() => {
    makePhoneCall();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderComponents title={translate(OtherTranslationKey.WhatApps)} />
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>
          {translate2(OtherTranslationKey.MayIhelpyou)}
        </Text>
        <Image
          source={require('../ContactUs/asset/demo.png')}
          style={styles.logo}
        />
        <Text style={styles.title} />
        <TouchableOpacity style={styles.callButton} onPress={makePhoneCall}>
          <Text style={styles.buttonText}>
            {translate2(OtherTranslationKey.Callnow)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 18,
      marginBottom: 10,
      color: colors.primary,
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 20,
      backgroundColor: 'transparent',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.primary,
    },
    callButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default WhatsApps;
