import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {ButtonText} from '../../components';
import {Popins} from '../../components/popins';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {
  RoutesTranslationKey,
  WelcomeScreenTranslationKey,
} from '../../translations/constants';
import {AppThemeColors, useAppTheme} from '../../themes/theme.config';
import {useNavigation} from '@react-navigation/native';
import {LoginStackName, LoginStackProps} from '../../navigator/types';

const {height: screen_height} = Dimensions.get('screen');
const WelcomeScreen: React.FC = () => {
  const {t} = useTranslation(RoutesTranslationKey.welcomeSreenRoute);
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const navigation = useNavigation<LoginStackProps>();

  const onStartPress = () => {
    navigation.navigate(LoginStackName.SignUpScreen);
  };
  const onAlreadyHaveAccountPress = () => {
    navigation.navigate(LoginStackName.SignInScreen);
  };
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        style={{flex: 1, justifyContent: 'flex-end'}}
        resizeMode="cover"
        source={require('../../assets/images/image_welcome.jpg')}>
        <LinearGradient
          colors={['#FFFFFF00', colors.background]}
          style={{height: screen_height * 0.15}}
        />
        {/* content */}
        <View style={{backgroundColor: colors.background, padding: 16}}>
          <View style={{marginBottom: 20}}>
            <Text style={styles.textLargeBoldBlack}>
              {t(WelcomeScreenTranslationKey.welcome)}{' '}
              <Text style={{color: colors.primary}}>
                {t(WelcomeScreenTranslationKey.erabook)}
              </Text>
            </Text>
            <Text style={styles.textMediumBlack}>
              {t(WelcomeScreenTranslationKey.description)}
            </Text>
          </View>
          {/* <View style={styles.dotWrapper}>
            {Array.from({length: 5})
              .fill(0)
              .map((_item, index) => {
                if (index === 0) {
                  return <View key={index} style={styles.dotOrange} />;
                }
                return <View key={index} style={styles.dotGray} />;
              })}
          </View> */}
          {/* button group */}
          <View style={{gap: 14}}>
            {/* <ButtonTextIcon
              onPress={onSignGooglePress}
              iconLeft={
                <Image
                  source={require('../../assets/icon/google.png')}
                  style={styles.iconGoogle}
                />
              }
              buttonStyle={styles.btnGoogle}
              labelStyle={{color: colors.text}}
              label={t(WelcomeScreenTranslationKey.google)}
            /> */}
            <ButtonText
              onPress={onStartPress}
              containerStyle={styles.btnStarted}
              labelStyle={{color: 'white'}}
              label={t(WelcomeScreenTranslationKey.started)}
            />
            <ButtonText
              onPress={onAlreadyHaveAccountPress}
              containerStyle={styles.btnLogin}
              labelStyle={{color: colors.textSecondary}}
              label={t(WelcomeScreenTranslationKey.account)}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default WelcomeScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    dotOrange: {
      width: 30,
      height: 8,
      borderRadius: 20,
      backgroundColor: colors.primary,
    },
    dotGray: {
      width: 8,
      height: 8,
      borderRadius: 20,
      backgroundColor: '#e0e0e0',
    },
    dotWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 30,
    },
    textMediumBlack: {
      fontSize: 16,
      color: colors.text,
      fontFamily: Popins['500'],
      textAlign: 'center',
    },
    textLargeBoldBlack: {
      fontSize: 22,
      color: colors.text,
      fontFamily: Popins['700'],
      textAlign: 'center',
    },
    btnGoogle: {
      borderWidth: 1,
      borderColor: colors.border,
      width: '100%',
      backgroundColor: colors.googleButton,
    },
    iconGoogle: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    btnStarted: {
      width: '100%',
      backgroundColor: colors.primary,
    },
    btnLogin: {
      width: '100%',
      backgroundColor: colors.secondary,
    },
  });
