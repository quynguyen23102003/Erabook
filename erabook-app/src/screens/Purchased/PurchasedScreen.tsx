import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import React, { memo, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Popins } from '../../components/popins';
import { AppThemeColors, useAppTheme } from 'themes/theme.config';
import { useTranslation } from 'react-i18next';
import {
  PurchasedSreenTranslationKey,
  RoutesTranslationKey,
} from 'translations/constants';
import { AppHeader } from '@components/AppHeader';
import { useAppDispatch, useAppSelector } from '@redux/storeAndStorage/persist';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RootStackName, RootStackProps } from '@navigator/types';
import { fetchPurchasesBook } from '@redux/actions/purchased.actions';
import LottieView from 'lottie-react-native';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { lottie } from '@assets/Icon';
import { BookHorizontalSkeleton } from '@components';
import { ScrollView } from 'react-native-gesture-handler';
import { clearPurchasedList } from '@redux/slice/purchased.slice';

interface HorizontalBookItemProp {
  item: IBook;
}

const { height, width } = Dimensions.get('screen');
const HEADER_HEIGHT = height * 0.12;
const PurchasedScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<RootStackProps>();
  const dispatch = useAppDispatch();
  const styles = useStyle(colors);
  const { t } = useTranslation(RoutesTranslationKey.purchasedRoute);
  const { bookList, isLoading } = useAppSelector(state => state.root.purchased);
  const isFocus = useIsFocused();

  useEffect(() => {
    // const unsubscribe = navigation.addListener('focus', async () => {
    //   await dispatch(fetchPurchasesBook());
    // });
    // return unsubscribe;
    const fetchData = async () => {
      dispatch(clearPurchasedList());
      await dispatch(fetchPurchasesBook());
      // if (bookList.length === 0) {
      //   await dispatch(fetchPurchasesBook());
      // } else {
      //   console.log('PurchasesBook already existed');
      // }
    };
    fetchData();
  }, [dispatch, navigation, isFocus]);

  const onBookPress = (bookId: string) => {
    navigation.navigate(RootStackName.EbookScreenDetail, { ebookId: bookId });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title={t(PurchasedSreenTranslationKey.Purchased)} />
      {!isLoading ? (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          data={bookList}
          ListEmptyComponent={
            <View style={styles.listEmptyWrapper}>
              <LottieView
                autoPlay
                loop={false}
                style={{ width: SCREEN_WIDTH * 0.4, height: SCREEN_WIDTH * 0.4 }}
                source={lottie.empty_cart}
              />
              <Text
                style={[
                  styles.textLargeBold,
                  { textAlign: 'center', marginHorizontal: 16 },
                ]}>
                {t(PurchasedSreenTranslationKey.YouHaventPurchased)}
              </Text>
            </View>
          }
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onBookPress(item._id)}>
              <HorizontalBookItem item={item} />
            </TouchableOpacity>
          )}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
          <BookHorizontalSkeleton heightForImage={height * 0.2} />
          <BookHorizontalSkeleton heightForImage={height * 0.2} />
          <BookHorizontalSkeleton heightForImage={height * 0.2} />
          <BookHorizontalSkeleton heightForImage={height * 0.2} />
          <BookHorizontalSkeleton heightForImage={height * 0.2} />
        </ScrollView>
      )}
    </View>
  );
};

const HorizontalBookItem: React.FC<HorizontalBookItemProp> = memo(({ item }) => {
  const { t } = useTranslation(RoutesTranslationKey.purchasedRoute);
  const { colors } = useAppTheme();
  const styles = useStyle(colors);
  // const PopupMenuData = [
  //   {
  //     icon: 'trash-bin-outline',
  //     label: t(PurchasedSreenTranslationKey.RemoveDownload),
  //   },
  //   {
  //     icon: 'document-text-outline',
  //     label: t(PurchasedSreenTranslationKey.ViewSeries),
  //   },
  //   {
  //     icon: 'checkbox-outline',
  //     label: t(PurchasedSreenTranslationKey.MarkAsFinished),
  //   },
  //   {
  //     icon: 'information-circle-outline',
  //     label: t(PurchasedSreenTranslationKey.AboutEbook),
  //   },
  // ];
  return (
    <View style={styles.bookItem}>
      <Image
        source={{ uri: item.coverImage }}
        style={styles.imageBook}
        resizeMode="contain"
      />

      <View style={styles.description}>
        <Text numberOfLines={3} style={styles.bookName}>
          {item.title}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <FontAwesome
            name="star-half-full"
            color={colors.gray}
            size={16}
            style={{ marginRight: 6, marginTop: 2 }}
          />
          <Text style={styles.textGrayNomal}>
            {item.rating.average.toFixed(1)}
          </Text>
        </View>
        <Text style={styles.textGrayNomal}>
          {t(PurchasedSreenTranslationKey.Purchased)}
        </Text>
      </View>
    </View>
  );
});

export default PurchasedScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    rightFoodItem: {
      width: width * 0.14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    textGrayNomal: {
      color: colors.gray,
      fontFamily: Popins[500],
      fontSize: 14,
    },

    bookName: {
      color: colors.text,
      fontFamily: Popins[600],
      fontSize: 16,
    },
    listEmptyWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    textLargeBold: {
      color: colors.text,
      fontFamily: Popins[600],
      fontSize: 20,
    },
    description: {
      flex: 1,
      marginHorizontal: 10,
    },

    bookItem: {
      flexDirection: 'row',
      paddingHorizontal: 24,
    },

    imageBook: {
      width: (height * 0.2 * 3) / 4,
      height: height * 0.2,
      borderRadius: 6,
    },

    btnSearch: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },

    headerWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: HEADER_HEIGHT,
      backgroundColor: colors.background,
      paddingHorizontal: 24,
      paddingBottom: height * 0.01,
      marginBottom: height * 0.02,
    },

    textBackLarge: {
      color: colors.text,
      fontFamily: Popins[600],
      marginLeft: 12,
      fontSize: 20,
    },

    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

// const DATA = [
//   {
//     id: 'b0c5071e-673f-11ee-8c99-0242ac120002',
//     name: 'Harry Potter and the Deathly Hallows',
//     image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
//     rate: 4.5,
//   },
//   {
//     id: 'ad2f9cd0-6740-11ee-8c99-0242ac120002',
//     name: 'Harry Potter and the Deathly Hallows',
//     image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
//     rate: 4.5,
//   },
//   {
//     id: 'b894ac46-6740-11ee-8c99-0242ac120002',
//     name: 'Harry Potter and the Deathly Hallows',
//     image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
//     rate: 4.5,
//   },
//   {
//     id: 'bdd678ba-6740-11ee-8c99-0242ac120002',
//     name: 'Harry Potter and the Deathly Hallows',
//     image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
//     rate: 4.5,
//   },
//   {
//     id: 'c5640c96-6740-11ee-8c99-0242ac120002',
//     name: 'Harry Potter and the Deathly Hallows',
//     image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
//     rate: 4.5,
//   },
//   {
//     id: 'd45f0ba6-6740-11ee-8c99-0242ac120002',
//     name: 'Harry Potter and the Deathly Hallows',
//     image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
//     rate: 4.5,
//   },
//   {
//     id: '34e74086-679d-11ee-8c99-0242ac120002',
//     name: 'Harry Potter and the Deathly Hallows',
//     image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
//     rate: 4.5,
//   },
//   {
//     id: '3c7376e4-679d-11ee-8c99-0242ac120002',
//     name: 'Harry Potter and the Deathly Hallows',
//     image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
//     rate: 4.5,
//   },
//   {
//     id: '3dde56e8-679d-11ee-8c99-0242ac120002',
//     name: 'Harry Potter and the Deathly Hallows',
//     image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
//     rate: 4.5,
//   },
// ];
