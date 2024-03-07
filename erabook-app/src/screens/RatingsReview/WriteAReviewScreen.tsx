import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {RootStackProps, WriteAReviewScreenProps} from '@navigator/types';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppHeader} from '@components/AppHeader';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {FeatherIcons, FontAwesomeIcons, OcticonsIcons} from '@utils/utils';
import {useAppDispatch, useAppSelector} from '@redux/storeAndStorage/persist';
import {Chip, Divider, Modal, Portal} from 'react-native-paper';
import {Popins} from '@components/popins';
import {useTranslation} from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import {ButtonText} from '@components';
import LottieView from 'lottie-react-native';
import {lottie} from '@assets/Icon';
import {setIsLoading} from '@redux/slice/app.slice';
import {createReview, updateReview} from '@services/api.service';

const WriteAReviewScreen = () => {
  const {
    params: {rating, comment},
  } = useRoute<WriteAReviewScreenProps['route']>();
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const navigation = useNavigation<RootStackProps>();
  const book = useAppSelector(state => state.root.book.currentBook);
  const [ratings, setRatings] = useState(rating);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [commentValue, setCommentValue] = useState('');
  const {t} = useTranslation(RoutesTranslationKey.ortherRoute);
  const dispatch = useAppDispatch();
  // event
  const onCommentChange = (text: string) => {
    setCommentValue(text);
  };

  const onSubmitPress = async () => {
    try {
      dispatch(setIsLoading(true));
      if (!book) {
        return;
      }
      if (!book?._user?.existingRating?.rating) {
        console.log('createReview');
        createReview(book?._id, ratings, commentValue);
      } else {
        console.log('updateReview');
        updateReview(book?._id, ratings, commentValue);
      }
      showModalSuccess();
    } catch (error) {
      console.log('onSubmitPress error' + error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  const showModalSuccess = () => setModalVisible(true);
  const hideModalSuccess = () => setModalVisible(false);
  const onCloseModalPress = () => {
    navigation.goBack();
    hideModalSuccess();
  };
  //   render
  const renderHeaderLeftComponent = useCallback(() => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FeatherIcons name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>
    );
  }, [colors.text, navigation]);

  return (
    <View style={styles.container}>
      {/* modal success */}
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
            {t(OtherTranslationKey.SubmittedSuccessfully)}
          </Text>
          <Text style={styles.text}>
            {t(OtherTranslationKey.ThankYouForProviding)} {book?.title ?? ''}
          </Text>
          <ButtonText
            onPress={onCloseModalPress}
            label={'OK'}
            labelStyle={{color: 'white'}}
            style={{width: '100%'}}
            containerStyle={[
              styles.btnModal,
              {backgroundColor: colors.primary},
            ]}
          />
        </Modal>
      </Portal>
      {/* header */}
      <AppHeader LeftComponent={renderHeaderLeftComponent} />
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        {/* book */}
        <Book book={book} />
        {/* rating */}
        <Ratings ratings={ratings} setRatings={setRatings} />
        <Divider style={{backgroundColor: colors.border, marginTop: 30}} />
        {/* comment */}
        <EnterComment
          currentComment={comment}
          onCommentChange={onCommentChange}
        />
      </ScrollView>
      <View>
        <Divider style={{backgroundColor: colors.border}} />
        <View style={{flexDirection: 'row', padding: 16}}>
          <ButtonText
            disabled={ratings === 0 || book?._id === undefined}
            onPress={() => onSubmitPress()}
            labelStyle={{color: 'white'}}
            label={t(OtherTranslationKey.Submit)}
            style={{flex: 1}}
            containerStyle={[styles.btnSubmit]}
          />
        </View>
      </View>
    </View>
  );
};

const EnterComment = ({
  onCommentChange,
  currentComment,
}: {
  onCommentChange: (value: string) => void;
  currentComment: string | undefined;
}) => {
  const {colors} = useAppTheme();
  const {t} = useTranslation(RoutesTranslationKey.ortherRoute);
  const styles = useStyle(colors);
  return (
    <View style={{margin: 16, flex: 1}}>
      <Text style={styles.textSmallBold}>
        {t(OtherTranslationKey.DescribeYourExperience)}
      </Text>
      <TextInput
        defaultValue={currentComment}
        onChangeText={onCommentChange}
        placeholder={t(OtherTranslationKey.HowDoYouFeel)}
        placeholderTextColor={colors.textTab}
        cursorColor={colors.primary}
        style={[
          styles.textBold,
          {flex: 1, textAlignVertical: 'top', minHeight: 150},
        ]}
        multiline
        underlineColorAndroid={'transparent'}
      />
    </View>
  );
};

interface RatingsProps {
  ratings: number;
  setRatings: React.Dispatch<React.SetStateAction<number>>;
}
const Ratings: React.FC<RatingsProps> = ({ratings, setRatings}) => {
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);

  return (
    <View style={{marginTop: '10%'}}>
      <Text style={styles.txtRating}>
        {translate(OtherTranslationKey.RatethisEbook)}
      </Text>
      <View style={styles.starWrapper}>
        {Array.from({length: 5}).map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => setRatings(index + 1)}
              activeOpacity={0.2}
              key={'star' + index}>
              {ratings !== 0 && index + 1 <= ratings ? (
                <OcticonsIcons name="star-fill" color={'#F89300'} size={35} />
              ) : (
                <OcticonsIcons name="star" color={colors.text} size={35} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const Book = ({book}: {book: IBook | null}) => {
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  if (!book) {
    return;
  }
  return (
    <View style={styles.bookContainer}>
      {/* image */}
      <Image
        source={{uri: book.coverImage}}
        resizeMode="center"
        style={styles.bookImage}
      />

      {/* description */}
      <View style={styles.descriptionWrapper}>
        <Text style={styles.textBold}>{book.title}</Text>
        <View style={{flexDirection: 'row', gap: 4}}>
          <FontAwesomeIcons
            name="star-half-empty"
            style={{color: colors.text, marginTop: 2}}
            size={16}
          />
          <Text style={[styles.text500]}>{book.rating.average.toFixed(1)}</Text>
        </View>
        <Text style={[styles.text500]}>
          ${parseFloat(book.price?.toString() ?? '0').toFixed(1)}
        </Text>

        {/* genre */}
        <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
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

export default WriteAReviewScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    btnModal: {
      backgroundColor: colors.secondary,
      marginTop: 10,
    },

    btnCancel: {
      flex: 0.5,
      backgroundColor: colors.secondary,
    },

    btnSubmit: {
      backgroundColor: colors.primary,
    },

    modalTitle: {
      color: colors.primary,
      fontFamily: Popins['600'],
      fontSize: 20,
      marginTop: 10,
    },

    text: {
      color: colors.text,
      fontFamily: Popins['400'],
      fontSize: 16,
      marginVertical: 10,
      textAlign: 'center',
    },

    modalContainer: {
      backgroundColor: colors.background,
      padding: 16,
      margin: 16,
      borderRadius: 30,
      alignItems: 'center',
    },

    starWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
      paddingTop: 15,
    },

    bookContainer: {
      marginHorizontal: 16,
      flexDirection: 'row',
    },

    text500: {
      color: colors.text,
      fontFamily: Popins[500],
      fontSize: 16,
    },
    txtRating: {
      textAlign: 'center',
      fontFamily: Popins[600],
      fontSize: 18,
      color: colors.text,
    },

    textSmallBold: {
      color: colors.text,
      fontSize: 14,
      fontFamily: Popins[700],
    },

    textBold: {
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
    },

    descriptionWrapper: {
      flexDirection: 'column',
      marginStart: 15,
      marginVertical: 5,
      flex: 1,
      gap: 6,
    },
  });
