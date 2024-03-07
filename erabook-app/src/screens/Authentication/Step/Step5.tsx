/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {ButtonText, CustomTextInput} from '../../../components';
import {AppThemeColors, useAppTheme} from '../../../themes/theme.config';
import {Popins} from '../../../components/popins';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Divider, Modal, Portal} from 'react-native-paper';

import {useTranslation} from 'react-i18next';
import {
  RoutesTranslationKey,
  Step5ScreenTranslationKey,
} from '../../../translations/constants';
import {ScrollView} from 'react-native-gesture-handler';
import {signUp} from '@services/auth.service';
import {SignUpResponse} from '@services/types';
import {appStorage} from '@redux/storeAndStorage/mmkv';
import {storageKey} from '@redux/types';
import {getUserInfo, updateUserInfo} from '@services/api.service';
import {useNavigation} from '@react-navigation/native';
import {RootStackName, RootStackProps} from '@navigator/types';
import {useAppDispatch} from '@redux/storeAndStorage/persist';
import {addUserData} from '@redux/slice/user.slice';
import {setIsLoading} from '@redux/slice/app.slice';
import {StepProps} from './Step1';
import LottieView from 'lottie-react-native';
import {fetchBooks} from '@redux/actions/book.actions';
import {fetchGenres} from '@redux/actions/genre.actions';
import {cleanBookList} from '@redux/slice/book.slice';

interface Step5FormValues {
  userName: string;
  email: string;
  password: string;
  confirmPassord: string;
}

const initialImageProfile =
  'https://img.freepik.com/free-photo/glowing-lines-human-heart-3d-shape-dark-background-generative-ai_191095-1435.jpg';
const Step5: React.FC<StepProps> = ({user}) => {
  const navigation = useNavigation<RootStackProps>();
  const {t} = useTranslation(RoutesTranslationKey.step5Route);
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = React.useState(false);
  const showModalError = () => setModalVisible(true);
  const hideModalError = () => setModalVisible(false);
  // console.log('Step5', user);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassord: '',
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordHidden(!isConfirmPasswordHidden);
  };

  const onSubmit: SubmitHandler<Step5FormValues> = async data => {
    try {
      dispatch(setIsLoading(true));
      const response: SignUpResponse = await signUp({
        emailAddress: data.email,
        password: data.password,
        username: data.userName,
      });
      // handler error
      if (response.status === 400) {
        showModalError();
      }
      // handle success
      if (response.status === 200) {
        const {accessToken, refreshToken} = response.data;
        appStorage.set(storageKey.accessToken, accessToken);
        appStorage.set(storageKey.refreshToken, refreshToken);
        // updateUserInfo
        await updateUserInfo({...user, avatarUrl: initialImageProfile});
        console.log('user.avatarUrl', user.avatarUrl);
        if (user.avatarUrl) {
          console.log('avatarUrl existed');
          const formData = new FormData();
          formData.append('avatarUrl', user.avatarUrl);
          await updateUserInfo(formData);
        }
        //save user to redux
        const userInfo = await getUserInfo();
        if (userInfo) {
          dispatch(addUserData(userInfo));
        }
        dispatch(cleanBookList());
        await dispatch(fetchBooks({page: 1}));
        await dispatch(fetchGenres());
        navigation.navigate(RootStackName.RootBottomTabs);
        navigation.reset({
          index: 1,
          routes: [
            {
              name: RootStackName.RootBottomTabs,
            },
          ],
        });
      }
      dispatch(setIsLoading(false));
    } catch (error) {
      console.log('onSubmit', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModalError}
          contentContainerStyle={{
            backgroundColor: colors.background,
            padding: 16,
            margin: 16,
            borderRadius: 30,
            alignItems: 'center',
          }}>
          <LottieView
            loop={false}
            autoPlay={true}
            style={{width: '30%', aspectRatio: 1}}
            source={require('../../../assets/lottie/error.json')}
          />
          <Text
            style={{
              color: 'red',
              fontFamily: Popins['600'],
              fontSize: 16,
              marginTop: 10,
            }}>
            {t(Step5ScreenTranslationKey.SignUpFailed)}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontFamily: Popins['400'],
              fontSize: 16,
              marginVertical: 10,
            }}>
            {t(Step5ScreenTranslationKey.UsernameOrEmail)}
          </Text>
          <ButtonText
            onPress={hideModalError}
            label={t(Step5ScreenTranslationKey.Agree)}
            labelStyle={{color: colors.textSecondary}}
            style={{
              width: '100%',
              marginTop: 10,
            }}
            containerStyle={{backgroundColor: colors.secondary}}
          />
        </Modal>
      </Portal>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headline}>
            {t(Step5ScreenTranslationKey.createAnAccount)}
          </Text>
          <Text style={[styles.subtitle, {marginVertical: 10}]}>
            {t(Step5ScreenTranslationKey.enterYourUsername)}
          </Text>

          {/* email */}
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            }}
            render={({field: {onChange, onBlur, value}}) => {
              const borderColor = errors.email ? 'red' : colors.primary;
              return (
                <CustomTextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  cursorColor={colors.primary}
                  label="Email"
                  style={[styles.input, {borderColor}]}
                />
              );
            }}
            name="email"
          />
          <View style={{height: 30, justifyContent: 'center'}}>
            {errors.email?.type === 'required' && (
              <Text style={styles.textError}>
                {t(Step5ScreenTranslationKey.thisIsRequired)}
              </Text>
            )}

            {errors.email?.type === 'pattern' && (
              <Text style={styles.textError}>
                {t(Step5ScreenTranslationKey.emailIsNot)}
              </Text>
            )}
          </View>

          {/* user name */}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => {
              const borderColor = errors.userName ? 'red' : colors.primary;
              return (
                <CustomTextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  cursorColor={colors.primary}
                  label={t(Step5ScreenTranslationKey.username)}
                  style={[styles.input, {borderColor}]}
                />
              );
            }}
            name="userName"
          />
          <View style={{height: 30, justifyContent: 'center'}}>
            {errors.userName && (
              <Text style={styles.textError}>
                {t(Step5ScreenTranslationKey.thisIsRequired)}
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
                    label={t(Step5ScreenTranslationKey.password)}
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
                {t(Step5ScreenTranslationKey.thisIsRequired)}
              </Text>
            )}

            {errors.password?.type === 'pattern' && (
              <Text style={styles.textError}>
                {t(Step5ScreenTranslationKey.passwordHasAt)}
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
                    label={t(Step5ScreenTranslationKey.confirmPassword)}
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

          <View style={{height: 30, justifyContent: 'center'}}>
            {errors.confirmPassord?.type === 'required' && (
              <Text style={styles.textError}>
                {t(Step5ScreenTranslationKey.thisIsRequired)}
              </Text>
            )}

            {errors.confirmPassord?.type === 'validate' && (
              <Text style={styles.textError}>
                {t(Step5ScreenTranslationKey.passwordIsNot)}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      <Divider />
      <ButtonText
        onPress={handleSubmit(onSubmit)}
        labelStyle={{color: 'white'}}
        label={t(Step5ScreenTranslationKey.signUp)}
        containerStyle={styles.btnSignUp}
      />
    </View>
  );
};

export default Step5;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    modalContainer: {
      alignItems: 'center',
      margin: 40,
      padding: 16,
      backgroundColor: colors.background,
      borderRadius: 50,
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
    input: {
      borderColor: colors.primary,
      borderBottomWidth: 1,
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['600'],
    },
    headline: {color: colors.text, fontFamily: Popins['600'], fontSize: 22},
    subtitle: {color: colors.text, fontSize: 16, fontFamily: Popins['400']},
    btnSignUp: {
      backgroundColor: colors.primary,
      margin: 16,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
  });
