import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {AppThemeColors, useAppTheme} from 'themes/theme.config';
import {Popins} from 'components/popins';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {ButtonText, CustomTextInput} from 'components';
import {useTranslation} from 'react-i18next';
import {
  LoginTranslationKey,
  RoutesTranslationKey,
  Step5ScreenTranslationKey,
} from 'translations/constants';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {Divider, Modal, Portal} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import {useAppDispatch, useAppSelector} from '@redux/storeAndStorage/persist';
import {useNavigation} from '@react-navigation/native';
import {
  LoginStackName,
  LoginStackProps,
  RootStackName,
  RootStackProps,
} from '@navigator/types';
import {login, SignInFormValues} from '@redux/actions/user.actions';
import {fetchBooks} from '@redux/actions/book.actions';
import {fetchGenres} from '@redux/actions/genre.actions';
import {resetIsLoginError, setIsLoading} from '@redux/slice/app.slice';
import {cleanBookList} from '@redux/slice/book.slice';

const HEADER_HEIGHT = 56;

const SignInScreen: React.FC = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const {t} = useTranslation(RoutesTranslationKey.loginRoute);
  const {colors} = useAppTheme();
  const dispatch = useAppDispatch();
  const loginNavigation = useNavigation<LoginStackProps>();
  const rootNavigation = useNavigation<RootStackProps>();
  const {isLoginError} = useAppSelector(state => state.root.app);

  const hideModalError = () => {
    dispatch(resetIsLoginError());
  };

  const styles = useStyle(colors);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };
  const onValidateValid: SubmitHandler<SignInFormValues> = async data => {
    try {
      const unwrapLogin = await dispatch(login(data)).unwrap();
      if (unwrapLogin) {
        dispatch(setIsLoading(true));
        dispatch(cleanBookList());
        await dispatch(fetchBooks({page: 1}));
        await dispatch(fetchGenres()).then(() => {
          rootNavigation.reset({
            index: 1,
            routes: [
              {
                name: RootStackName.RootBottomTabs,
              },
            ],
          });
          dispatch(setIsLoading(false));
        });
      }
    } catch (error) {
      console.log('onValidateValid' + error);
    }
  };

  const onForgotPasswordPress = () => {
    loginNavigation.navigate(LoginStackName.ForgotPassword);
  };

  const onBackPress = () => {
    rootNavigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Portal>
        <Modal
          visible={isLoginError}
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
            {t(LoginTranslationKey.SignInFailed)}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontFamily: Popins['400'],
              fontSize: 16,
              marginVertical: 10,
            }}>
            {t(LoginTranslationKey.UsernameOrEmail)}
          </Text>
          <ButtonText
            onPress={hideModalError}
            label={t(LoginTranslationKey.Agree)}
            labelStyle={{color: colors.textSecondary}}
            style={{width: '100%'}}
            containerStyle={{
              backgroundColor: colors.secondary,
              marginTop: 10,
            }}
          />
        </Modal>
      </Portal>
      {/* navigation */}
      <View style={{height: HEADER_HEIGHT, marginVertical: 10}}>
        <TouchableOpacity
          onPress={onBackPress}
          style={{
            height: '100%',
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{flex: 1}}
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
        <TouchableWithoutFeedback
          style={{flex: 1}}
          containerStyle={{flex: 1}}
          onPress={Keyboard.dismiss}>
          {/* introduce */}
          <View style={{paddingHorizontal: 16}}>
            <Text
              style={{
                fontSize: 24,
                color: colors.text,
                fontFamily: Popins['600'],
              }}>
              {t(LoginTranslationKey.HelloThere)}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: colors.text,
                fontFamily: Popins['400'],
              }}>
              {t(LoginTranslationKey.PleaseEnterYour)}
            </Text>
          </View>

          {/* form */}
          <View style={{padding: 16}}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => {
                const borderColor = errors.username ? 'red' : colors.primary;
                return (
                  <CustomTextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    cursorColor={colors.primary}
                    label={t(LoginTranslationKey.Username)}
                    style={[styles.input, {borderColor}]}
                  />
                );
              }}
              name="username"
            />
            <View style={{height: 30, justifyContent: 'center'}}>
              {errors.username && (
                <Text style={styles.textError}>
                  {t(LoginTranslationKey.ThisIsRequired)}
                </Text>
              )}
            </View>

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
                      label={t(LoginTranslationKey.Password)}
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

            <View style={{height: 30, justifyContent: 'center'}}>
              {errors.password?.type === 'required' && (
                <Text style={styles.textError}>
                  {t(LoginTranslationKey.ThisIsRequired)}
                </Text>
              )}
              {errors.password?.type === 'pattern' && (
                <Text style={styles.textError}>
                  {t(Step5ScreenTranslationKey.passwordHasAt)}
                </Text>
              )}
            </View>

            <TouchableOpacity onPress={onForgotPasswordPress}>
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: Popins['600'],
                  fontSize: 16,
                  marginTop: 20,
                  textAlign: 'center',
                }}>
                {t(LoginTranslationKey.ForgotPassword)}
              </Text>
            </TouchableOpacity>
          </View>

          {/*another method login */}
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 16,
            }}>
            <Divider style={{flex: 1, backgroundColor: colors.border}} />
            <Text
              style={{
                color: colors.text,
                fontFamily: Popins['400'],
                fontSize: 14,
                marginHorizontal: 10,
                textAlign: 'center',
              }}>
              {t(LoginTranslationKey.orContinueWith)}
            </Text>
            <Divider style={{flex: 1, backgroundColor: colors.border}} />
          </View> */}

          {/* button group */}
          {/* <View
            style={{
              flexDirection: 'row',
              gap: 10,
              padding: 20,
              paddingHorizontal: 16,
            }}>
            <TouchableOpacity
              onPress={onSignInGooglePress}
              style={{
                borderColor: colors.border,
                paddingVertical: 16,
                alignItems: 'center',
                borderWidth: 1,
                flex: 1,
                borderRadius: 40,
              }}>
              <Image
                source={require('../../assets/icon/google.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderColor: colors.border,
                paddingVertical: 16,
                alignItems: 'center',
                flex: 1,
                borderWidth: 1,
                borderRadius: 40,
              }}>
              <FontAwesome name="apple" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderColor: colors.border,
                paddingVertical: 16,
                alignItems: 'center',
                flex: 1,
                borderWidth: 1,
                borderRadius: 40,
              }}>
              <MaterialCommunityIcons
                name="facebook"
                size={24}
                color="#0866ff"
              />
            </TouchableOpacity>
          </View> */}
          {/* login */}
          <View
            style={{
              flex: 1,
            }}
          />
          <Divider style={{backgroundColor: colors.border}} />
          <ButtonText
            onPress={handleSubmit(onValidateValid)}
            labelStyle={{color: 'white'}}
            containerStyle={{
              backgroundColor: colors.primary,
              margin: 16,
            }}
            label={t(LoginTranslationKey.SignIn)}
          />
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
    },

    iconEye: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: 12,
      zIndex: 1,
    },

    textError: {
      color: 'red',
      fontSize: 14,
      fontFamily: Popins['400'],
    },
    input: {
      borderColor: colors.primary,
      borderBottomWidth: 1,
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['600'],
    },
  });
