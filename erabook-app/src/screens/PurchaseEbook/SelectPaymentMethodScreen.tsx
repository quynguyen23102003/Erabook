import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {AppHeader} from '@components/AppHeader';
import {
  ArtDesignIcons,
  FeatherIcons,
  FontAwesomeIcons,
  MaterialIcons,
} from '@utils/utils';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Image} from 'moti';
import {Popins} from '@components/popins';
import {Chip} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {RootStackName, RootStackProps} from '@navigator/types';
import {useAppSelector} from '@redux/storeAndStorage/persist';
import {getAllPaymentMethod} from '@services/api.service';
import {PaymentMethod} from '@services/types';
import {images} from '@assets/Icon';
import {useTranslation} from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';

const SelectPaymentMethodScreen = () => {
  // const insets = useSafeAreaInsets();
  const book = useAppSelector(state => state.root.book.currentBook);
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const navigation = useNavigation<RootStackProps>();
  const [listPayment, setListPayment] = useState<PaymentMethod[]>([]);
  const {t} = useTranslation(RoutesTranslationKey.ortherRoute);

  useEffect(() => {
    const fetchAllPaymentMethod = async () => {
      const res = await getAllPaymentMethod();
      if (!res) {
        return;
      }
      setListPayment(res);
    };
    fetchAllPaymentMethod();
  }, []);

  // event
  const onBackPress = useCallback(() => navigation.goBack(), [navigation]);

  const formatBankNumber = (cardNumber: string) => {
    let hideNumber = '**** **** **** ****';
    return hideNumber.slice(0, -4) + cardNumber.slice(-4);
  };

  const onAddCreditCardPress = () => {
    navigation.navigate(RootStackName.AddNewPaymentScreen);
  };

  const onCreditCardPress = (paymentMethod: PaymentMethod) => {
    navigation.navigate(RootStackName.ReviewSumaryScreen, {
      paymentId: paymentMethod._id,
      cardNumber: paymentMethod.cardNumber,
      bankName: paymentMethod.bankName,
    });
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
              style={{color: colors.text, marginRight: 6}}
              size={18}
            />
            <Text style={[styles.text500]}>
              {book.rating.average.toFixed(1)}
            </Text>
          </View>
          <Text style={[styles.text500]}>${book.price}</Text>

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

  const renderPaymentMethod = () => {
    return (
      <View style={{marginTop: '10%', paddingHorizontal: 16}}>
        <TouchableOpacity
          onPress={onAddCreditCardPress}
          style={styles.paymentMethodWrapper}>
          <View style={styles.creditCard}>
            <ArtDesignIcons name="creditcard" size={26} color={colors.text} />
          </View>
          <Text style={styles.nameMethod}>
            {t(OtherTranslationKey.CreditCard)}
          </Text>
          <View style={{flex: 1}} />
          <MaterialIcons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
        {listPayment.map(payment => {
          return (
            <TouchableOpacity
              key={payment._id}
              onPress={() => onCreditCardPress(payment)}
              style={styles.paymentMethodWrapper}>
              <View style={styles.bankImageWrapper}>
                <Image
                  style={styles.bankImage}
                  source={
                    payment._type === 'visa' ? images.visa : images.mastercard
                  }
                />
              </View>
              <Text style={styles.nameMethod}>
                {formatBankNumber(payment.cardNumber)}
              </Text>
              <View style={{flex: 1}} />
              <FeatherIcons
                name="chevron-right"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          );
        })}
      </View>
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
        title={t(OtherTranslationKey.SelectPaymentMethod)}
        icon
        LeftComponent={renderLeftNavigation}
      />
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        {/* book */}
        {renderBook()}
        {/* payment method */}
        {renderPaymentMethod()}
      </ScrollView>
    </View>
  );
};

export default SelectPaymentMethodScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    creditCard: {
      width: 45,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
    },

    paymentMethodWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderColor: colors.border,
    },

    bankImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },

    bankImageWrapper: {
      borderColor: colors.border,
      borderWidth: 1,
      width: 45,
      backgroundColor: 'white',
      padding: 6,
      height: 45,
      borderRadius: 45,
    },
    nameMethod: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['600'],
    },
    text500: {
      color: colors.text,
      fontFamily: Popins[500],
      fontSize: 16,
    },
    style_text_icon: {
      flexDirection: 'row',
    },
    text700: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins[700],
    },
    bookImage: {
      width: '30%',
      height: '110%',
      maxHeight: 190,
      minHeight: 150,
      borderRadius: 10,
      resizeMode: 'contain',
    },
    bookContainer: {
      marginHorizontal: 16,
      flexDirection: 'row',
    },
    style_group: {
      // alignItems: 'center'
    },
    style_text: {
      flexDirection: 'column',
      marginStart: 15,
      marginVertical: 5,
      flex: 1,
      gap: 6,
    },
  });
