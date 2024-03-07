/* eslint-disable react-native/no-inline-styles */
import {Text, View} from 'react-native';
import React from 'react';
import {useAppTheme} from 'themes/theme.config';
import {useTranslation} from 'react-i18next';
import {
  ForgotPasswordTranslationKey,
  RoutesTranslationKey,
} from 'translations/constants';
import {Popins} from 'components/popins';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {ButtonText, CustomTextInput} from 'components';
import CustomHeader from './component/CustomHeader';
import {useAppDispatch} from '@redux/storeAndStorage/persist';
import {setIsLoading} from '@redux/slice/app.slice';
import {useNavigation} from '@react-navigation/native';
import {LoginStackName, LoginStackProps} from '@navigator/types';
import {sendOTPCode} from '@services/auth.service';

interface FormValues {
  email: string;
}

const ForgotPassword = () => {
  const navigation = useNavigation<LoginStackProps>();
  const {colors} = useAppTheme();
  const {t} = useTranslation(RoutesTranslationKey.forgotPasswordRoute);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
    },
  });
  const dispatch = useAppDispatch();

  const onValidateSuccess: SubmitHandler<FormValues> = async data => {
    try {
      dispatch(setIsLoading(true));
      await sendOTPCode(data.email);
      navigation.navigate(LoginStackName.OTPCodeVerification, {
        emailAddress: data.email,
      });
    } catch (error) {
      console.log('Forgot Password error' + error);
    }
    dispatch(setIsLoading(false));
  };
  return (
    <CustomHeader>
      <View style={{paddingHorizontal: 16, flex: 1}}>
        <Text
          style={{
            color: colors.text,
            fontFamily: Popins['600'],
            fontSize: 24,
          }}>
          {t(ForgotPasswordTranslationKey.ForgotPassword)}
        </Text>

        <Text
          style={{
            marginTop: 16,
            color: colors.text,
            fontFamily: Popins['400'],
            fontSize: 16,
          }}>
          {t(ForgotPasswordTranslationKey.EnterYourEmail)}
        </Text>

        {/* email group */}
        <View style={{marginTop: 16}}>
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
            }}
            render={({field: {onChange, onBlur, value}}) => {
              const borderColor = errors.email ? 'red' : colors.primary;
              return (
                <CustomTextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  cursorColor={colors.primary}
                  label={'Email'}
                  style={{
                    borderColor,
                    borderBottomWidth: 1,
                    color: colors.text,
                    fontSize: 16,
                    fontFamily: Popins['600'],
                  }}
                />
              );
            }}
            name="email"
          />

          {/* email error */}
          <View style={{height: 30, justifyContent: 'center'}}>
            {errors.email?.type === 'required' && (
              <Text
                style={{
                  color: 'red',
                  fontSize: 14,
                  fontFamily: Popins['400'],
                }}>
                {t(ForgotPasswordTranslationKey.ThisIsRequired)}
              </Text>
            )}
            {errors.email?.type === 'pattern' && (
              <Text
                style={{
                  color: 'red',
                  fontSize: 14,
                  fontFamily: Popins['400'],
                }}>
                {t(ForgotPasswordTranslationKey.EmailIsNot)}
              </Text>
            )}
          </View>
        </View>
      </View>
      {/* submit */}
      <ButtonText
        onPress={handleSubmit(onValidateSuccess)}
        containerStyle={{backgroundColor: colors.primary, margin: 16}}
        labelStyle={{color: 'white'}}
        label={t(ForgotPasswordTranslationKey.Continue)}
      />
    </CustomHeader>
  );
};

export default ForgotPassword;
