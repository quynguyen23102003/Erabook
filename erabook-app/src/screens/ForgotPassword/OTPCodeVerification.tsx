/* eslint-disable react-native/no-inline-styles */
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppThemeColors, useAppTheme} from 'themes/theme.config';
import {
  OTPCodeTranslationKey,
  RoutesTranslationKey,
} from 'translations/constants';
import {useTranslation} from 'react-i18next';
import CustomHeader from './component/CustomHeader';
import {Modal, Portal, Text} from 'react-native-paper';
import {Popins} from 'components/popins';
import {ButtonText} from 'components';
import {LoginStackName, OTPCodeVerificationScreenProps} from '@navigator/types';
import {sendOTPCode, validateOTPCode} from '@services/auth.service';
import LottieView from 'lottie-react-native';
import {useAppDispatch} from '@redux/storeAndStorage/persist';
import {setIsLoading} from '@redux/slice/app.slice';

const OTPCodeVerification: React.FC<OTPCodeVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const {emailAddress} = route.params;
  const {colors} = useAppTheme();
  const {t} = useTranslation(RoutesTranslationKey.otpCodeRoute);
  const styles = useStyle(colors);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [time, setTime] = useState(60);
  const [modalVisible, setModalVisible] = React.useState(false);
  const inputRefs = [
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
    React.createRef<TextInput>(),
  ];
  const dispatch = useAppDispatch();

  useEffect(() => {
    let countDown = setInterval(() => {
      setTime(preValue => {
        if (preValue > 0) {
          return preValue - 1;
        }
        return preValue;
      });
    }, 1000);

    return () => clearInterval(countDown);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.match(/^[0-9]$/) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < 3) {
        // Focus to next input field
        if (inputRefs[index + 1].current) {
          inputRefs[index + 1].current?.focus();
        }
      }
      if (index === 3 && value !== '') {
        console.log('first');
        Keyboard.dismiss();
      }
    }
  };

  const clearInput = (index: number) => {
    const newOtp = [...otp];
    newOtp[index] = '';
    setOtp(newOtp);
  };

  const onResendPress = async () => {
    try {
      setTime(60);
      await sendOTPCode(emailAddress);
    } catch (error) {}
  };
  const onConfirmPress = async () => {
    dispatch(setIsLoading(true));
    try {
      const optString = otp.join('');
      // console.log(optString);
      if (optString.length === 4) {
        const response = await validateOTPCode(emailAddress, optString);
        if (response) {
          moveToNextScreen();
        } else {
          showModalError();
        }
      }
    } catch (error) {
      console.log('OTPcode verify onConfirmPress error: ' + error);
    }
    dispatch(setIsLoading(false));
  };

  const showModalError = () => {
    setModalVisible(true);
  };
  const hideModalError = () => {
    setModalVisible(false);
  };

  const moveToNextScreen = () => {
    navigation.navigate(LoginStackName.CreatePassword, {
      code: otp.join(''),
      emailAddress: emailAddress,
    });
  };
  return (
    <>
      <CustomHeader>
        {/* text content */}
        <View
          style={{
            minHeight: '50%',
            justifyContent: 'space-between',
          }}>
          {/* modal errror */}
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={hideModalError}
              contentContainerStyle={{
                backgroundColor: colors.background,
                padding: 20,
                margin: 20,
                borderRadius: 30,
                alignItems: 'center',
              }}>
              <LottieView
                loop={false}
                autoPlay={true}
                style={{width: '30%', aspectRatio: 1}}
                source={require('../../assets/lottie/error.json')}
              />
              <Text
                style={{
                  color: 'red',
                  fontFamily: Popins['600'],
                  fontSize: 20,
                  marginTop: 10,
                }}>
                {t(OTPCodeTranslationKey.ValidateError)}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: Popins['400'],
                  fontSize: 16,
                  marginVertical: 10,
                }}>
                {t(OTPCodeTranslationKey.OTPCodeIs)}
              </Text>
              <ButtonText
                onPress={hideModalError}
                label={t(OTPCodeTranslationKey.Agree)}
                labelStyle={{color: colors.textSecondary}}
                containerStyle={{backgroundColor: colors.primary}}
                style={{
                  width: '100%',
                  marginTop: 10,
                }}
              />
            </Modal>
          </Portal>
          <View>
            <Text
              style={{
                marginHorizontal: 20,
                color: colors.text,
                fontFamily: Popins['600'],
                fontSize: 26,
              }}>
              {t(OTPCodeTranslationKey.YouGotEmail)}
            </Text>

            <Text
              style={{
                marginHorizontal: 20,
                color: colors.text,
                fontFamily: Popins['400'],
                fontSize: 16,
              }}>
              {t(OTPCodeTranslationKey.WeHaveSend)}
            </Text>
          </View>
          {/* otp group */}
          <View>
            <View style={styles.otpWrapper}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={styles.input}
                  value={value}
                  cursorColor={colors.primary}
                  onChangeText={text => handleOtpChange(text, index)}
                  onPressIn={() => clearInput(index)}
                  keyboardType="numeric"
                  maxLength={1}
                  onFocus={() => {
                    inputRefs[index].current?.setNativeProps({
                      style: [styles.input, styles.focusedInput],
                    });
                  }}
                  onBlur={() => {
                    inputRefs[index].current?.setNativeProps({
                      style: [styles.input],
                    });
                  }}
                />
              ))}
            </View>
            {/* end otp group */}

            {/* timming */}
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                textAlign: 'center',
                fontFamily: Popins['400'],
              }}>
              {t(OTPCodeTranslationKey.DidntRecieveEmail)}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                textAlign: 'center',
                fontFamily: Popins['400'],
                marginVertical: 20,
              }}>
              {t(OTPCodeTranslationKey.YouCanSend)}{' '}
              <Text style={{color: colors.primary}}>{time}</Text>{' '}
              {t(OTPCodeTranslationKey.Second)}
            </Text>
            {time === 0 && (
              <ButtonText
                onPress={onResendPress}
                labelStyle={{color: colors.primary}}
                containerStyle={{paddingVertical: 0}}
                label="Resend"
              />
            )}
            {/* end timming */}
          </View>
        </View>
        {/* btn confirm */}
        <ButtonText
          onPress={onConfirmPress}
          containerStyle={{backgroundColor: colors.primary}}
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
          }}
          labelStyle={{color: 'white'}}
          label={t(OTPCodeTranslationKey.Confirm)}
        />
      </CustomHeader>
    </>
  );
};

export default OTPCodeVerification;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    otpWrapper: {
      marginVertical: 30,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    input: {
      paddingVertical: 16,
      paddingHorizontal: 26,
      backgroundColor: colors.googleButton,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      textAlign: 'center',
      fontSize: 24,
      borderRadius: 14,
    },
    focusedInput: {
      backgroundColor: colors.secondary,
      borderColor: colors.primary,
    },
  });
