import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {AppThemeColors, useAppTheme} from '../../../themes/theme.config';
import {Popins} from '../../../components/popins';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';
import {ButtonText} from '../../../components';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {
  RoutesTranslationKey,
  Step4ScreenTranslationKey,
} from '../../../translations/constants';
import {Divider} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import CountryPicker, {
  Country,
  DARK_THEME,
} from 'react-native-country-picker-modal';
import {StepProps} from './Step1';
import moment from 'moment';
import {useAppSelector} from '@redux/storeAndStorage/persist';
import {ThemeKey} from '@redux/slice/setting.slice';

type FormValues = {
  fullName?: string;
  phoneNumber: string;
};

const initialImageProfile =
  'https://img.freepik.com/free-photo/glowing-lines-human-heart-3d-shape-dark-background-generative-ai_191095-1435.jpg';

const initialCountry: Country = {
  callingCode: ['84'],
  cca2: 'VN',
  currency: ['VND'],
  flag: 'flag-vn',
  name: 'Vietnam',
  region: 'Asia',
  subregion: 'South-Eastern Asia',
};

const Step4: React.FC<StepProps> = ({onNextPress, setUser, user}) => {
  const {t} = useTranslation(RoutesTranslationKey.step4Route);
  const birthdayRef = useRef<TextInput>(null);
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const [birthday, setBirthday] = useState('');
  const [birthdayError, setBirthdayError] = useState('');
  const [profileImage, setProfileImage] = useState<string>();
  const [country, setCountry] = useState<Country>(initialCountry);
  const {setting} = useAppSelector(state => state.root);
  const [modalCountryVisible, setModalCountryVisible] =
    useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
    },
  });

  const switchModalCountryVisible = () =>
    setModalCountryVisible(!modalCountryVisible);

  const onDatePickerChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    if (event.type === 'dismissed' || event.type === 'neutralButtonPressed') {
      return;
    }
    if (selectedDate) {
      // Lấy ngày, tháng và năm từ đối tượng Date
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();

      // Định dạng lại ngày theo "dd/MM/yyyy"
      const formattedDate = `${day}/${month}/${year}`;
      setBirthday(formattedDate);
      setBirthdayError('');
      if (birthdayRef.current) {
        birthdayRef.current.setNativeProps({text: formattedDate});
      }
    }
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: onDatePickerChange,
      mode: 'date',
      is24Hour: true,
      positiveButton: {textColor: colors.primary},
      negativeButton: {textColor: colors.primary},
      neutralButton: {textColor: colors.primary},
    });
  };

  const validateBirthday = (value: string) => {
    let error = '';
    if (!value) {
      // error = 'This is required';
      error = t(Step4ScreenTranslationKey.thisIsRequired);
      setBirthdayError(error);
      return;
    }
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (datePattern.test(value)) {
      setBirthday(value);
    } else {
      error = t(Step4ScreenTranslationKey.theBirthdayIs);
    }
    setBirthdayError(error);
  };

  const onGetImageProfilePress = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
    if (result.didCancel) {
      console.log('User cancelled camera picker');
      return;
    } else if (result.errorCode === 'camera_unavailable') {
      Alert.alert(t(Step4ScreenTranslationKey.cameraNotAvailable));
      return;
    } else if (result.errorCode === 'permission') {
      Alert.alert(t(Step4ScreenTranslationKey.permissionNotSatisfied));
      return;
    } else if (result.errorCode === 'others') {
      if (result.errorMessage) {
        console.log('react-native-image-picker', result.errorMessage);
      }
      return;
    }
    if (result.assets) {
      const uri = result.assets[0].uri;
      if (uri) {
        setProfileImage(uri);
      }
    }
  };

  const onSubmit: SubmitHandler<FormValues> = data => {
    if (!birthdayError) {
      const date = moment(birthday, 'DD/MM/YYYY');
      const epochTime = date.unix(); // Lấy Epoch time
      console.log(epochTime);
      setUser({
        ...user,
        username: data.fullName,
        phoneAddress: data.phoneNumber,
        fullName: data.fullName,
        birthDate: epochTime.toString(),
        country: country.name.toString(),
        avatarUrl: profileImage,
      });
      onNextPress();
    }
  };

  const onInvalid: SubmitErrorHandler<FormValues> = () => {
    validateBirthday(birthday);
  };

  const onBirthdayChange = (value: string) => {
    validateBirthday(value);
  };

  const onCountrySelect = (_country: Country) => {
    setCountry(_country);
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 32}}>
        <View style={styles.container}>
          <Text style={styles.headline}>
            {t(Step4ScreenTranslationKey.completeYourProfile)}
          </Text>
          <Text style={styles.subtitle}>
            {t(Step4ScreenTranslationKey.dontWorryOnly)}
          </Text>

          {/* avatar */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{uri: profileImage ?? initialImageProfile}}
              style={styles.avatar}
            />
            <TouchableOpacity
              onPress={() => onGetImageProfilePress()}
              style={styles.btnChangeAvatar}>
              <FontAwesome name="pencil" color={colors.background} size={12} />
            </TouchableOpacity>
          </View>

          {/* fullname */}
          <View style={{marginTop: 30}}>
            <Text style={styles.label}>
              {t(Step4ScreenTranslationKey.fullName)}
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => {
                const borderColor = errors.fullName ? 'red' : colors.primary;
                return (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    cursorColor={colors.primary}
                    style={[styles.input, {borderColor}]}
                  />
                );
              }}
              name="fullName"
            />

            <View style={{height: 35}}>
              {errors.fullName && (
                <Text style={styles.textError}>
                  {t(Step4ScreenTranslationKey.thisIsRequired)}
                </Text>
              )}
            </View>
          </View>

          {/* phone number */}
          <View>
            <Text style={styles.label}>
              {t(Step4ScreenTranslationKey.phoneNumber)}
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
                pattern: /^0\d{9}$/,
              }}
              render={({field: {onChange, onBlur, value}}) => {
                const borderColor = errors.phoneNumber ? 'red' : colors.primary;
                return (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    inputMode="numeric"
                    cursorColor={colors.primary}
                    style={[styles.input, {borderColor}]}
                  />
                );
              }}
              name="phoneNumber"
            />

            <View style={{height: 35}}>
              {errors.phoneNumber?.type === 'required' ? (
                <Text style={styles.textError}>
                  {t(Step4ScreenTranslationKey.thisIsRequired)}
                </Text>
              ) : errors.phoneNumber?.type === 'pattern' ? (
                <Text style={styles.textError}>
                  {t(Step4ScreenTranslationKey.thePhoneNumber)}
                </Text>
              ) : (
                <View />
              )}
            </View>
          </View>

          {/* date of birth */}
          <View>
            <Text style={styles.label}>
              {t(Step4ScreenTranslationKey.dateOfBirth)}
            </Text>
            <View>
              <TextInput
                ref={birthdayRef}
                placeholder="dd/MM/yyyy"
                placeholderTextColor={colors.gray}
                onChangeText={value => onBirthdayChange(value)}
                cursorColor={colors.primary}
                style={styles.input}
              />

              <TouchableOpacity
                onPress={showDatepicker}
                style={styles.btnDatePicker}>
                <FontAwesome5
                  name="calendar-alt"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={{height: 35}}>
              {birthdayError && (
                <Text style={styles.textError}>{birthdayError}</Text>
              )}
            </View>
          </View>

          {/* country */}
          <View style={{paddingBottom: 16}}>
            <Text style={[styles.label, {marginBottom: 10}]}>
              {t(Step4ScreenTranslationKey.country)}
            </Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              <CountryPicker
                theme={setting.themeColor !== ThemeKey.Light ? DARK_THEME : {}}
                countryCode={country.cca2}
                region="Asia"
                withFilter
                withFlag
                withCountryNameButton
                withModal
                withFlagButton
                preferredCountries={['VN']}
                modalProps={{visible: modalCountryVisible}}
                onClose={() => setModalCountryVisible(false)}
                onOpen={() => setModalCountryVisible(true)}
                onSelect={(c: Country) => onCountrySelect(c)}
              />
              <TouchableOpacity onPress={switchModalCountryVisible}>
                <FontAwesome5 name="caret-down" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <Divider />
        <ButtonText
          onPress={handleSubmit(onSubmit, onInvalid)}
          labelStyle={{color: 'white'}}
          label={t(Step4ScreenTranslationKey.continue)}
          containerStyle={styles.btnContinue}
        />
      </View>
    </View>
  );
};

export default Step4;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    btnContinue: {
      backgroundColor: colors.primary,
      margin: 16,
    },
    textError: {
      color: 'red',
      fontSize: 14,
      fontFamily: Popins['400'],
      marginVertical: 6,
    },
    btnDatePicker: {
      position: 'absolute',
      bottom: 0,
      padding: 10,
      right: 0,
    },
    input: {
      borderColor: colors.primary,
      borderBottomWidth: 1,
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['600'],
    },
    label: {
      color: colors.text,
      fontSize: 14,
      fontFamily: Popins['600'],
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 100,
    },
    avatarWrapper: {
      width: 90,
      height: 90,
      borderRadius: 100,
      alignSelf: 'center',
      marginTop: 16,
    },
    btnChangeAvatar: {
      backgroundColor: colors.primary,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      position: 'absolute',
      bottom: 0,
      right: 2,
    },
    headline: {color: colors.text, fontFamily: Popins['600'], fontSize: 22},
    subtitle: {color: colors.text, fontSize: 16, fontFamily: Popins['400']},
    container: {
      flex: 1,
      padding: 16,
      paddingVertical: 0,
      backgroundColor: colors.background,
    },
  });
