import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {AppHeader} from '@components/AppHeader';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {FeatherIcons, FontAwesomeIcons} from '@utils/utils';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {
  RootStackName,
  RootStackParamList,
  RootStackProps,
} from '@navigator/types';
import {Chip, Divider, Modal, Portal} from 'react-native-paper';
import {Popins} from '@components/popins';
import {ButtonText} from '@components';
import {useAppDispatch, useAppSelector} from '@redux/storeAndStorage/persist';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {images, lottie} from '@assets/Icon';
import {purchaseBook} from '@services/api.service';
import LottieView from 'lottie-react-native';
import {useTranslation} from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import {setIsLoading} from '@redux/slice/app.slice';
import {addBookToPurchasedList} from '@redux/slice/purchased.slice';

type ReviewSummaryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  RootStackName.ReviewSumaryScreen
>;
const ReviewSummaryScreen = () => {
  const {
    params: {bankName, cardNumber, paymentId},
  } = useRoute<ReviewSummaryScreenProps['route']>();
  // console.log('bankName', bankName);
  // console.log('cardNumber', cardNumber);
  // console.log('paymentId', paymentId);

  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const navigation = useNavigation<RootStackProps>();
  const book = useAppSelector(state => state.root.book.currentBook);
  const [modalVisible, setModalVisible] = React.useState(false);
  const {t} = useTranslation(RoutesTranslationKey.ortherRoute);
  const dispatch = useAppDispatch();
  const {bookList} = useAppSelector(state => state.root.purchased);
  // event
  const showModalSuccess = () => setModalVisible(true);
  const hideModalSuccess = () => setModalVisible(false);
  const onBackPress = useCallback(() => navigation.goBack(), [navigation]);
  const onChangeCreditCardPress = () => {
    navigation.navigate(RootStackName.SelectPaymentMethodScreen);
  };

  const formatBankNumber = () => {
    let hideNumber = '**** **** **** ****';
    return hideNumber.slice(0, -4) + cardNumber.slice(-4);
  };

  const onConfirmPaymentPress = async () => {
    try {
      dispatch(setIsLoading(true));
      await purchaseBook(book?._id, paymentId).then(() => {
        dispatch(setIsLoading(false));
        showModalSuccess();
      });
      if (book && bookList.length === 0) {
        dispatch(addBookToPurchasedList(book));
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      console.log('onConfirmPaymentPress error', error);
    }
  };

  const onCloseModalPress = () => {
    hideModalSuccess();
    navigation.popToTop();
  };

  const onOpenEbookPress = () => {
    hideModalSuccess();
    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          {name: RootStackName.RootBottomTabs},
          {
            name: RootStackName.EbookScreenDetail,
            params: {ebookId: book?._id},
          },
          {
            name: RootStackName.ReadbookScreen,
            params: {ebookId: book?._id},
          },
        ],
      }),
    );
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

  const renderBook = () => {
    if (!book) {
      return;
    }
    return (
      <View style={styles.bookContainer}>
        {/* image */}
        <Image source={{uri: book.coverImage}} style={styles.bookImage} />

        {/* description */}
        <View style={styles.style_text}>
          <Text style={styles.text700}>{book.title}</Text>
          <View style={styles.style_text_icon}>
            <FontAwesomeIcons
              name="star-half-empty"
              style={{color: colors.gray, marginRight: 6}}
              size={18}
            />
            <Text style={[styles.text500]}>
              {book.rating.average.toFixed(1)}
            </Text>
          </View>
          <Text style={[styles.text500]}>
            $ {(parseFloat(book.price?.toString() ?? '0') ?? 0).toFixed(1)}
          </Text>

          {/* genre */}
          <View style={{flexDirection: 'row', gap: 6, flexWrap: 'wrap'}}>
            {book.genres?.map(item => (
              <Chip
                key={item._id}
                textStyle={{color: colors.gray, fontSize: 12}}
                style={{width: 'auto', backgroundColor: colors.border}}>
                {item.name}
              </Chip>
            ))}
          </View>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModalSuccess}
          contentContainerStyle={styles.modalContainer}>
          <LottieView
            loop={false}
            autoPlay={true}
            style={{width: '40%', aspectRatio: 1}}
            source={lottie.success}
          />
          <Text style={styles.modalTitle}>
            {t(OtherTranslationKey.SuccessfulPurchase)}
          </Text>
          <Text style={styles.text}>
            {t(OtherTranslationKey.YouHaveSuccessful)} {book?.title ?? ''}
          </Text>
          <ButtonText
            onPress={onOpenEbookPress}
            label={t(OtherTranslationKey.OpenEbook)}
            labelStyle={{color: 'white'}}
            style={{width: '100%'}}
            containerStyle={[
              styles.btnModal,
              {backgroundColor: colors.primary},
            ]}
          />

          <ButtonText
            onPress={onCloseModalPress}
            label={t(OtherTranslationKey.Close)}
            labelStyle={{color: colors.textSecondary}}
            style={{width: '100%'}}
            containerStyle={styles.btnModal}
          />
        </Modal>
      </Portal>
      {/* header */}
      <AppHeader
        title={t(OtherTranslationKey.ReviewSummary)}
        icon
        LeftComponent={renderLeftNavigation}
      />
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        {renderBook()}
        <Divider style={styles.divider} />

        {/* invoice */}
        <View style={styles.invoiceWrapper}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.textGray}>{t(OtherTranslationKey.Price)}</Text>
            <Text style={styles.textGrayBold}>
              {parseFloat(book?.price?.toString() || '0').toFixed(1)} $
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.textGray}>{t(OtherTranslationKey.Tax)}</Text>
            <Text style={styles.textGrayBold}>1.0 $</Text>
          </View>

          <Divider />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.textGray}>{t(OtherTranslationKey.Total)}</Text>
            <Text style={styles.textGrayBold}>
              {(parseFloat(book?.price?.toString() || '0') + 1).toFixed(1)} $
            </Text>
          </View>
        </View>
        <Divider
          style={{
            margin: 10,
          }}
        />

        {/* payment method */}
        <View style={{padding: 16}}>
          <Text style={styles.textBold}>
            {t(OtherTranslationKey.SelectedPaymentMethod)}
          </Text>
          <View style={styles.paymentWrapper}>
            <View style={styles.bankImageWrapper}>
              <Image
                style={styles.bankImage}
                source={bankName === 'visa' ? images.visa : images.mastercard}
              />
            </View>
            <Text style={styles.bankNumber}>{formatBankNumber()}</Text>
            <View style={{flex: 1}} />
            <ButtonText
              onPress={onChangeCreditCardPress}
              labelStyle={{color: colors.primary}}
              label={t(OtherTranslationKey.Change)}
            />
          </View>
        </View>
        <ButtonText
          onPress={onConfirmPaymentPress}
          containerStyle={styles.btnConfirm}
          labelStyle={{color: 'white'}}
          label={t(OtherTranslationKey.ConfirmPayment)}
        />
      </ScrollView>
    </View>
  );
};

export default ReviewSummaryScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    btnModal: {
      backgroundColor: colors.secondary,
      marginTop: 10,
    },

    text: {
      color: colors.text,
      fontFamily: Popins['400'],
      fontSize: 16,
      marginVertical: 10,
      textAlign: 'center',
    },

    modalTitle: {
      color: colors.primary,
      fontFamily: Popins['600'],
      fontSize: 20,
      marginTop: 10,
    },

    modalContainer: {
      backgroundColor: colors.background,
      padding: 16,
      margin: 16,
      borderRadius: 30,
      alignItems: 'center',
    },

    btnConfirm: {
      backgroundColor: colors.primary,
      marginBottom: 16,
      marginHorizontal: 16,
    },

    bankImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },

    bankNumber: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['600'],
    },

    bankImageWrapper: {
      borderColor: colors.border,
      borderWidth: 1,
      backgroundColor: 'white',
      width: 60,
      padding: 6,
      height: 60,
      borderRadius: 60,
    },

    paymentWrapper: {
      flexDirection: 'row',
      gap: 16,
      marginVertical: 16,
      alignItems: 'center',
    },

    divider: {
      marginTop: '10%',
      marginHorizontal: 16,
      marginVertical: 10,
    },

    invoiceWrapper: {
      backgroundColor: colors.googleButton,
      margin: 16,
      padding: 16,
      borderRadius: 16,
      borderColor: colors.border,
      borderWidth: 1,
      gap: 16,
    },

    textGray: {
      fontSize: 16,
      fontFamily: Popins['400'],
      color: colors.gray,
    },

    textBold: {
      fontSize: 16,
      fontFamily: Popins['600'],
      color: colors.text,
    },

    textGrayBold: {
      fontSize: 16,
      fontFamily: Popins['600'],
      color: colors.gray,
    },

    bookContainer: {
      marginHorizontal: 16,
      flexDirection: 'row',
    },

    text500: {
      color: colors.gray,
      fontFamily: Popins[500],
      fontSize: 14,
    },
    style_text_icon: {
      flexDirection: 'row',
    },
    text700: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins[700],
    },

    style_text: {
      flexDirection: 'column',
      marginStart: 15,
      marginVertical: 5,
      flex: 1,
      gap: 6,
    },

    bookImage: {
      width: '30%',
      height: '110%',
      maxHeight: 190,
      borderRadius: 10,
      resizeMode: 'contain',
    },
  });
