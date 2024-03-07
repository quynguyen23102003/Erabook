import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Popins} from '../../components/popins';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AppThemeColors, useAppTheme} from 'themes/theme.config';
import {useTranslation} from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from 'translations/constants';
import {getWishlist, removeWishlist} from 'services/api.service';
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native-gesture-handler';
import {AppHeader} from '@components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import {RootStackName, RootStackProps} from '@navigator/types';
import {FontAwesomeIcons} from '@utils/utils';
import {lottie} from '@assets/Icon';
import LottieView from 'lottie-react-native';
import {BookHorizontalSkeleton} from '@components';

interface HorizontalBookItemProps {
  item: IBook;
  onDeletePress: (ebookId: string) => void;
}

const {height: screen_height, width: screen_with} = Dimensions.get('screen');
const HEADER_HEIGHT = screen_height * 0.12;
const WishlistScreen: React.FC = () => {
  const [wishlist, setWishlist] = useState<IBook[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const {colors} = useAppTheme();
  const {t} = useTranslation(RoutesTranslationKey.ortherRoute);
  const navigation = useNavigation<RootStackProps>();
  const styles = useStyle(colors);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWishlist();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchWishlist = async () => {
    const response: IBook[] = await getWishlist();
    setWishlist(response);
    setIsFetching(false);
  };

  const onBookPress = (bookId: string) =>
    navigation.navigate(RootStackName.EbookScreenDetail, {
      ebookId: bookId,
    });

  const handleRefresh = useCallback(() => {
    fetchWishlist();
  }, []);

  const onDeletePress = async (ebookId: string) => {
    try {
      const newWishlist = wishlist.filter(i => i._id !== ebookId);
      setWishlist(newWishlist);
      await removeWishlist(ebookId);
    } catch (error) {
      console.log('onDeletePress error');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <AppHeader title={t(OtherTranslationKey.Wishlist)} />
      {!isFetching ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
          overScrollMode="never"
          ItemSeparatorComponent={() => <View style={{height: 16}} />}
          data={wishlist}
          ListEmptyComponent={
            <View style={styles.listEmptyWrapper}>
              <LottieView
                autoPlay
                loop={false}
                style={{width: screen_with * 0.4, height: screen_with * 0.4}}
                source={lottie.wishlist_empty}
              />
              <Text style={[styles.textLargeBold, {textAlign: 'center'}]}>
                {t(OtherTranslationKey.YourWishlistIsEmpty)}
              </Text>
            </View>
          }
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => onBookPress(item._id)}>
              <HorizontalBookItem onDeletePress={onDeletePress} item={item} />
            </TouchableOpacity>
          )}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 16, gap: 16}}>
          <BookHorizontalSkeleton heightForImage={screen_height * 0.2} />
          <BookHorizontalSkeleton heightForImage={screen_height * 0.2} />
          <BookHorizontalSkeleton heightForImage={screen_height * 0.2} />
          <BookHorizontalSkeleton heightForImage={screen_height * 0.2} />
          <BookHorizontalSkeleton heightForImage={screen_height * 0.2} />
        </ScrollView>
      )}
    </View>
  );
};

const HorizontalBookItem: React.FC<HorizontalBookItemProps> = memo(
  ({item, onDeletePress}) => {
    const {colors} = useAppTheme();
    const styles = useStyle(colors);
    const {t} = useTranslation(RoutesTranslationKey.ortherRoute);

    return (
      <View style={styles.bookItem}>
        <Image
          source={{uri: item.coverImage}}
          style={styles.imageBook}
          resizeMode="contain"
        />
        <View style={styles.description}>
          <Text numberOfLines={3} style={styles.bookName}>
            {item.title}
          </Text>
          <Text numberOfLines={3} style={styles.bookAuthor}>
            {item.author?.name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <FontAwesome
              name="star-half-full"
              color={colors.gray}
              size={14}
              style={{marginRight: 6, marginTop: 3}}
            />
            <Text style={styles.textGrayNomal}>
              {item.rating.average.toString().substring(0, 3)}
            </Text>
          </View>
          {item.price === 0 || item.price === null ? (
            <Text style={styles.textGrayNomal}>
              {t(OtherTranslationKey.Free)}
            </Text>
          ) : (
            <Text style={styles.textGrayNomal}>$ {item.price}</Text>
          )}
        </View>

        <View style={styles.rightFoodItem}>
          <TouchableOpacity onPress={() => onDeletePress(item._id)}>
            <FontAwesomeIcons
              name="close"
              size={22}
              color={colors.text}
              style={{margin: 6}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

export default WishlistScreen;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    rightFoodItem: {
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

    description: {
      flex: 1,
      marginHorizontal: 10,
    },

    bookItem: {
      flexDirection: 'row',
      paddingHorizontal: 24,
    },

    bookAuthor: {
      color: colors.primary,
      fontFamily: Popins[600],
      fontSize: 14,
    },

    imageBook: {
      width: (screen_height * 0.2 * 3) / 4,
      height: screen_height * 0.2,
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
      paddingHorizontal: 24,
      paddingBottom: screen_with * 0.01,
      marginBottom: screen_with * 0.02,
      backgroundColor: colors.background,
    },

    textLargeBold: {
      color: colors.text,
      fontFamily: Popins[600],
      fontSize: 20,
    },

    listEmptyWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },

    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DATA = [
  {
    id: 'b0c5071e-673f-11ee-8c99-0242ac120002',
    name: 'Harry Potter and the Deathly Hallows',
    image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
    rate: 4.5,
    price: 5.99,
  },
  {
    id: 'ad2f9cd0-6740-11ee-8c99-0242ac120002',
    name: 'Harry Potter and the Deathly Hallows',
    image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
    price: 5.99,
    rate: 4.5,
  },
  {
    id: 'b894ac46-6740-11ee-8c99-0242ac120002',
    name: 'Harry Potter and the Deathly Hallows Harry Potter and the Deathly Hallows',
    image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
    price: 5.99,
    rate: 4.5,
  },
  {
    id: 'bdd678ba-6740-11ee-8c99-0242ac120002',
    name: 'Harry Potter and the Deathly Hallows',
    image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
    price: 5.99,
    rate: 4.5,
  },
  {
    id: 'c5640c96-6740-11ee-8c99-0242ac120002',
    name: 'Harry Potter and the Deathly Hallows',
    image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
    price: 5.99,
    rate: 4.5,
  },
  {
    id: 'd45f0ba6-6740-11ee-8c99-0242ac120002',
    name: 'Harry Potter and the Deathly Hallows',
    image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
    price: 5.99,
    rate: 4.5,
  },
  {
    id: '34e74086-679d-11ee-8c99-0242ac120002',
    name: 'Harry Potter and the Deathly Hallows',
    image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
    price: 5.99,
    rate: 4.5,
  },
  {
    id: '3c7376e4-679d-11ee-8c99-0242ac120002',
    name: 'Harry Potter and the Deathly Hallows',
    image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
    price: 5.99,
    rate: 4.5,
  },
  {
    id: '3dde56e8-679d-11ee-8c99-0242ac120002',
    name: 'Harry Potter and the Deathly Hallows',
    image: 'https://m.media-amazon.com/images/I/51V6zvaRjkL.jpg',
    price: 5.99,
    rate: 4.5,
  },
];
