/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import {AppThemeColors, useAppTheme} from 'themes/theme.config';
import {useTranslation} from 'react-i18next';
import {
  CreatePasswordTranslationKey,
  RoutesTranslationKey,
} from 'translations/constants';
import CustomHeader from './component/CustomHeader';
import {Popins} from 'components/popins';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {ButtonText, CustomTextInput} from 'components';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CreatePasswordScreenProps, LoginStackName} from '@navigator/types';
import {createNewPassword} from '@services/auth.service';
import {useAppDispatch} from '@redux/storeAndStorage/persist';
import {setIsLoading} from '@redux/slice/app.slice';

interface FormValues {
  password: string;
  confirmPassord: string;
}

const CreatePassword: React.FC<CreatePasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const {code, emailAddress} = route.params;
  const {colors} = useAppTheme();
  const {t} = useTranslation(RoutesTranslationKey.createPasswordRoute);
  const styles = useStyle(colors);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassord: '',
    },
  });
  const dispatch = useAppDispatch();

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordHidden(!isConfirmPasswordHidden);
  };

  const onSubmit: SubmitHandler<FormValues> = async data => {
    dispatch(setIsLoading(true));
    try {
      const response = await createNewPassword(
        emailAddress,
        code,
        data.password,
      );
      if (response) {
        navigation.navigate(LoginStackName.SignInScreen);
      } else {
      }
    } catch (error) {
      console.log('create password onSubmit error', error);
    }
    dispatch(setIsLoading(false));
  };
  return (
    <CustomHeader>
      <View style={{flex: 1}}>
        <Text
          style={{
            marginHorizontal: 20,
            color: colors.text,
            fontFamily: Popins['600'],
            fontSize: 26,
          }}>
          {t(CreatePasswordTranslationKey.CreateNewPassword)}
        </Text>

        <Text
          style={{
            marginHorizontal: 20,
            color: colors.text,
            fontFamily: Popins['400'],
            fontSize: 16,
          }}>
          {t(CreatePasswordTranslationKey.EnterNewPassword)}
        </Text>

        <View style={{padding: 20}}>
          {/* text input group */}
          {/* password */}
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: /^.{8,}$/,
            }}
            render={({field: {onChange, onBlur, value}}) => {
              const borderColor = errors.password ? 'red' : colors.primary;
              return (
                <View>
                  <CustomTextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    cursorColor={colors.primary}
                    label={t(CreatePasswordTranslationKey.Password)}
                    style={[styles.input, {borderColor}]}
                    secureTextEntry={isPasswordHidden}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.iconEye}>
                    <FontAwesome5
                      name={isPasswordHidden ? 'eye-slash' : 'eye'}
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
            name="password"
          />

          {/* password error*/}

          <View style={{height: 30, justifyContent: 'center'}}>
            {errors.password?.type === 'required' && (
              <Text style={styles.textError}>
                {t(CreatePasswordTranslationKey.ThisIsRequired)}
              </Text>
            )}
            {errors.password?.type === 'pattern' && (
              <Text style={styles.textError}>
                {t(CreatePasswordTranslationKey.PasswordHasAt)}
              </Text>
            )}
          </View>

          {/* confirm passwrord */}
          <Controller
            control={control}
            rules={{
              required: true,
              validate: (value, formValues) => value === formValues.password,
            }}
            render={({field: {onChange, onBlur, value}}) => {
              const borderColor = errors.confirmPassord
                ? 'red'
                : colors.primary;
              return (
                <View>
                  <CustomTextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    cursorColor={colors.primary}
                    label={t(CreatePasswordTranslationKey.ConfirmPassword)}
                    style={[styles.input, {borderColor}]}
                    secureTextEntry={isConfirmPasswordHidden}
                  />
                  <TouchableOpacity
                    onPress={toggleConfirmPasswordVisibility}
                    style={styles.iconEye}>
                    <FontAwesome5
                      name={isConfirmPasswordHidden ? 'eye-slash' : 'eye'}
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
            name="confirmPassord"
          />

          {/* confirm passwrord error*/}

          <View style={{height: 30, justifyContent: 'center'}}>
            {errors.confirmPassord?.type === 'required' && (
              <Text style={styles.textError}>
                {t(CreatePasswordTranslationKey.ThisIsRequired)}
              </Text>
            )}
            {errors.confirmPassord?.type === 'validate' && (
              <Text style={styles.textError}>
                {t(CreatePasswordTranslationKey.PasswordIsNot)}
              </Text>
            )}
          </View>
        </View>
      </View>
      <ButtonText
        onPress={handleSubmit(onSubmit)}
        containerStyle={{
          backgroundColor: colors.primary,
          margin: 20,
        }}
        labelStyle={{color: 'white'}}
        label={t(CreatePasswordTranslationKey.Continue)}
      />
    </CustomHeader>
  );
};

export default CreatePassword;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    input: {
      borderColor: colors.primary,
      borderBottomWidth: 1,
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['600'],
    },
    iconEye: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: 12,
    },
    textError: {
      color: 'red',
      fontSize: 14,
      fontFamily: Popins['400'],
    },
  });
