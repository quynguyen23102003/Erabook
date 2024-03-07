import {
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { AppHeader } from '@components/AppHeader';
import { FeatherIcons } from '@utils/utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackName, RootStackProps } from '@navigator/types';
import { useNavigation } from '@react-navigation/native';
import { Popins } from '@components/popins';
import { ButtonText } from '@components';
import { addPaymentMethod } from '@services/api.service';
import { useAppDispatch } from '@redux/storeAndStorage/persist';
import { setIsLoading } from '@redux/slice/app.slice';
import { images, lottie } from '@assets/Icon';
import { useTranslation } from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import { Modal, Portal } from 'react-native-paper';
import LottieView from 'lottie-react-native';

export type Bank = {
  name: string;
  image: string;
};
const AddPaymentMentthodScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const styles = useStyle(colors);
  const navigation = useNavigation<RootStackProps>();
  const { t } = useTranslation(RoutesTranslationKey.ortherRoute);
  const dispatch = useAppDispatch();

  // card info
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  const [ccv, setCcv] = useState('');
  const [ccvError, setCcvError] = useState('');
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [isCheck, setIsCheck] = useState<boolean>(true);
  const [selectedCard, setSelectedCard] = useState<
    'gpay' | 'momo' | 'visa' | 'mastercard' | 'zalopay'
  >('visa');
  // const [rememberCard, setRememberCard] = useState(true);

  // event
  const onAddPress = async () => {
    validate();
    if (
      cardNumberError.length === 0 &&
      fullNameError.length === 0 &&
      expiryDateError.length === 0 &&
      ccvError.length === 0 &&
      cardNumber.length > 0 &&
      fullName.length > 0 &&
      expiryDate.length > 0 &&
      ccv.length > 0
    ) {
      dispatch(setIsLoading(true));
      await addPaymentMethod({
        _type: selectedCard,
        bankName: selectedCard,
        cardExpiration: expiryDate,
        cardHolderName: fullName,
        cardNumber: cardNumber,
        cardSecret: ccv,
      }).then((_result: string) => {
        dispatch(setIsLoading(false));
        setModalVisible(false);
      });
    }
  };

  const validate = () => {
    validateCardNumber();
    validateExpiryDate();
    validateCcv();
    validateFullName();
  };

  const validateCardNumber = () => {
    if (cardNumber.length === 0) {
      setCardNumberError(t(OtherTranslationKey.ThisFieldIs));
    } else if (cardNumber.length < 16) {
      setCardNumberError(t(OtherTranslationKey.CardIsNot));
    } else {
      setCardNumberError('');
    }
  };

  const validateFullName = () => {
    if (fullName.length === 0) {
      setFullNameError(t(OtherTranslationKey.ThisFieldIs));
    } else {
      setFullNameError('');
    }
  };

  const validateExpiryDate = () => {
    const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/\d{2}$/;
    if (expiryDate.length === 0) {
      setExpiryDateError(t(OtherTranslationKey.ThisFieldIs));
    } else if (!dateRegex.test(expiryDate)) {
      setExpiryDateError(t(OtherTranslationKey.DateIsNot));
    } else {
      setExpiryDateError('');
    }
  };
  const validateCcv = () => {
    if (ccv.length === 0) {
      setCcvError(t(OtherTranslationKey.ThisFieldIs));
    } else {
      setCcvError('');
    }
  };

  const onBackPress = useCallback(() => navigation.goBack(), [navigation]);

  const onCartNumberChange = (value: string) => {
    setCardNumber(value);
    validateCardNumber();
  };

  const onFullnameChange = (value: string) => {
    setFullName(value.toUpperCase());
    validateFullName();
  };

  const onExpiryChange = (text: string) => {
    setExpiryDate(text);
    validateExpiryDate();
  };

  const onCcvChange = (text: string) => {
    setCcv(text);
    validateCcv();
  };

  const formatCartNumber = () => {
    let formattedPhoneNumber = '**** **** **** ****';
    for (let i = 0; i < cardNumber.length; i++) {
      formattedPhoneNumber = formattedPhoneNumber.replace('*', cardNumber[i]);
    }
    return formattedPhoneNumber;
  };

  //render
  const renderLeftNavigation = useCallback(
    () => (
      <TouchableOpacity onPress={onBackPress}>
        <FeatherIcons name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>
    ),
    [colors.text, onBackPress],
  );
  const onCloseModalPress = () => {
    setModalVisible(true);
    navigation.goBack();
};

  const renderCard = () => {
    return (
      <ImageBackground
        style={styles.creditCardWrapper}
        source={require('../../../assets/images/credit_card.png')}>
        <View style={styles.creditCardTitleWrapper}>
          <Text style={[{ marginTop: 10 }, styles.textBlackBold]}>
            Credit Card
          </Text>
        </View>

        {/* card number */}
        <Text style={styles.textBlack}>{formatCartNumber()}</Text>

        {/* name*/}
        <Text style={styles.textBlack}>
          {fullName.length === 0 ? '**** **** **** ****' : fullName}
        </Text>

        <View style={{ flexDirection: 'row', gap: 100 }}>
          {/* expiry date */}
          <View>
            <Text style={[styles.textSmallBlack]}>
              {t(OtherTranslationKey.ExpiryDate)}
            </Text>
            <Text style={styles.textBlack}>
              {expiryDate.length === 0 ? '**/**' : expiryDate}
            </Text>
          </View>

          {/* ccv */}
          <View>
            <Text style={styles.textSmallBlack}>CCV</Text>
            <Text style={styles.textBlack}>
              {ccv.length === 0 ? '***' : ccv}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  };

  const renderEnterInformation = () => {
    return (
      <>
        {/* card number */}
        <View style={{ marginHorizontal: 16 }}>
          <Text style={styles.textBold}>
            {t(OtherTranslationKey.SelectPaymentCard)}
          </Text>
          <View style={{ flexDirection: 'row', marginVertical: 10, gap: 20 }}>
            <TouchableOpacity
              onPress={() => setSelectedCard('visa')}
              style={[
                {
                  borderColor:
                    selectedCard === 'visa' ? colors.primary : colors.gray,
                },
                styles.btnCreditCardType,
              ]}>
              <Image style={styles.creditCardImage} source={images.visa} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedCard('mastercard')}
              style={[
                {
                  borderColor:
                    selectedCard === 'mastercard'
                      ? colors.primary
                      : colors.gray,
                },
                styles.btnCreditCardType,
              ]}>
              <Image
                style={styles.creditCardImage}
                source={images.mastercard}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.textBold}>
            {t(OtherTranslationKey.CardNumber)}
          </Text>
          <TextInput
            onEndEditing={validateCardNumber}
            style={styles.input}
            cursorColor={colors.primary}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
            onChangeText={onCartNumberChange}
            maxLength={16}
            inputMode="numeric"
          />
          <View style={{ height: 30, justifyContent: 'center' }}>
            {<Text style={styles.textError}>{cardNumberError}</Text>}
          </View>
        </View>

        {/* fullname */}
        <View style={{ marginHorizontal: 16 }}>
          <Text style={styles.textBold}>{t(OtherTranslationKey.FullName)}</Text>
          <TextInput
            autoCapitalize="characters"
            style={styles.input}
            cursorColor={colors.primary}
            onChangeText={onFullnameChange}
            onEndEditing={validateFullName}
          />
          <View style={{ height: 30, justifyContent: 'center' }}>
            {<Text style={styles.textError}>{fullNameError}</Text>}
          </View>
        </View>

        {/* expiryDate */}
        <View style={{ marginHorizontal: 16, flexDirection: 'row', gap: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.textBold}>
              {t(OtherTranslationKey.ExpiryDate)}
            </Text>
            <TextInput
              onEndEditing={validateExpiryDate}
              style={styles.inputHalfWidth}
              cursorColor={colors.primary}
              onChangeText={onExpiryChange}
              maxLength={5}
              placeholder="MM/YY"
              placeholderTextColor={colors.gray}
            />
            <View style={{ height: 30, justifyContent: 'center' }}>
              {<Text style={styles.textError}>{expiryDateError}</Text>}
            </View>
          </View>

          {/* ccv */}
          <View style={{ flex: 1 }}>
            <Text style={styles.textBold}>CCV</Text>
            <TextInput
              style={styles.inputHalfWidth}
              keyboardType="number-pad"
              cursorColor={colors.primary}
              onChangeText={onCcvChange}
              maxLength={3}
            />
            <View style={{ height: 30, justifyContent: 'center' }}>
              {<Text style={styles.textError}>{ccvError}</Text>}
            </View>
          </View>
        </View>
      </>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      {/* header */}
      <AppHeader
        title={t(OtherTranslationKey.AddNewPayment)}
        icon
        LeftComponent={renderLeftNavigation}
      />
      <Portal>
        <Modal
          visible={!modalVisible}
          onDismiss={() => setModalVisible(true)}
          contentContainerStyle={styles.modalContainer}>
          <LottieView
            loop={false}
            autoPlay={true}
            style={{ width: '40%', aspectRatio: 1 }}
            source={lottie.success}
          />
          <Text style={styles.modalTitle}>
            {t(OtherTranslationKey.Addpaymentmethodsuccessfully)}
          </Text>
          <ButtonText
            onPress={onCloseModalPress}
            label={t(OtherTranslationKey.Close)}
            labelStyle={{ color: colors.textSecondary }}
            style={{ width: '100%' }}
            containerStyle={styles.btnModal}
          />
        </Modal>
      </Portal>
      <Portal>
                <Modal
                    visible={!isCheck}
                    onDismiss={() => setIsCheck(true)}
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
                        style={{ width: '30%', aspectRatio: 1 }}
                        source={require('../../../assets/lottie/error.json')}
                    />
                    <Text
                        style={{
                            color: 'red',
                            fontFamily: Popins['600'],
                            fontSize: 20,
                            marginTop: 10,
                        }}>
                        {t(OtherTranslationKey.Addingpaymentmethodfailed)}
                    </Text>
                    <ButtonText
                        onPress={() => setIsCheck(true)}
                        label={t(OtherTranslationKey.Agree)}
                        labelStyle={{ color: colors.textSecondary }}
                        style={{ width: '100%' }}
                        containerStyle={{
                            backgroundColor: colors.secondary,
                            marginTop: 10,
                        }}
                    />
                </Modal>
            </Portal>
      {/* image card */}
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
        <Pressable android_disableSound onPress={() => Keyboard.dismiss()}>
          {renderCard()}

          {renderEnterInformation()}
          {/* enter information */}

          <ButtonText
            containerStyle={{ backgroundColor: colors.primary, margin: 16 }}
            onPress={onAddPress}
            labelStyle={{ color: 'white' }}
            label={t(OtherTranslationKey.Add)}
          />
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default AddPaymentMentthodScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    rememberCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      alignSelf: 'flex-start',
    },

    inputHalfWidth: {
      width: '100%',
      marginTop: 6,
      borderRadius: 16,
      backgroundColor: colors.googleButton,
      paddingHorizontal: 16,
      color: colors.text,
    },
    input: {
      marginTop: 6,
      borderRadius: 16,
      backgroundColor: colors.googleButton,
      paddingHorizontal: 16,
      color: colors.text,
    },

    textBold: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['500'],
    },

    creditCardImage: {
      marginHorizontal: 6,
      width: 50,
      height: 50,
      resizeMode: 'contain',
    },

    btnCreditCardType: {
      borderWidth: 2,
      borderRadius: 10,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },

    textBlack: {
      color: 'black',
      fontSize: 16,
      letterSpacing: 3,
      fontFamily: Popins['400'],
    },

    textSmallBlack: {
      color: 'black',
      fontSize: 14,
      fontFamily: Popins['400'],
    },

    textBlackBold: {
      color: 'black',
      fontSize: 16,
      fontFamily: Popins['600'],
    },
    creditCardTitleWrapper: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    creditCardWrapper: {
      height: 200,
      margin: 16,
      padding: 16,
      marginTop: 0,
      justifyContent: 'flex-end',
    },

    textError: {
      color: 'red',
      fontSize: 14,
      fontFamily: Popins['400'],
    },
    modalContainer: {
      backgroundColor: colors.background,
      padding: 16,
      margin: 16,
      borderRadius: 30,
      alignItems: 'center',
    },
    modalTitle: {
      color: colors.primary,
      fontFamily: Popins['600'],
      fontSize: 20,
      marginTop: 10,
    },
    btnModal: {
      backgroundColor: colors.secondary,
      marginTop: 10,
    },
  });
