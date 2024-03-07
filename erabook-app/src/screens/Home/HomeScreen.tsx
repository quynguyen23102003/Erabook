import {
  Dimensions,
  LayoutChangeEvent,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/storeAndStorage/persist';
import { fetchBooks } from 'redux/actions/book.actions';
import EbookItem2 from 'components/Item/EbookItem2';
import { cleanBookList } from 'redux/slice/book.slice';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { ListGenreSeries } from 'components/ListGenreSeries';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { Popins } from '@components/popins';
import { FooterListLoading } from '@components/loading/footerListLoading';
import HomeHeader from '@screens/Home/components/HomeHeader';
import { getImageRatio } from '../../helper/string.helper';
import { ActivityIndicator } from 'react-native-paper';
import { callApi } from '@services/axios.service';
import { RootStackName, RootStackProps } from '@navigator/types';
import { useNavigation } from '@react-navigation/native';
import { ListBookHorizontal } from '@components/ListBookHorizontal';
import { BookVerticalSkeleton } from '@components';
import { useTranslation } from 'react-i18next';
import { OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 16;
const HomeScreen: React.FC = () => {
  const [loadingWhenRender, setLoadingWhenRender] = useState(true);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackProps>();
  const { t } = useTranslation(RoutesTranslationKey.ortherRoute);
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const { bookList, pagination } = useAppSelector(state => state.root.book);
  const [recommendList, setRecommendList] = useState([]);
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoadingWhenRender(false);
    }, 0);

    fetchRecommendedBook();
    return () => clearTimeout(timeOut);
  }, []);

  const fetchRecommendedBook = async () => {
    try {
      const { data } = await callApi().get('/books/forYou');
      if (data) {
        setRecommendList(data);
      }
    } catch (error) {
      console.log('fetchRecommendedBook error: ' + error);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNext) {
      dispatch(fetchBooks({ page: pagination.currentPage + 1 }));
    }
  }, [dispatch, pagination.currentPage, pagination.hasNext]);

  const handleRefresh = useCallback(() => {
    dispatch(cleanBookList());
    dispatch(fetchBooks({ page: 1 }));
  }, [dispatch]);

  const widthImage = useMemo(() => {
    return (width - PADDING_HORIZONTAL * 2 - 8) / 2;
  }, []);

  const heightForImage = useMemo(() => {
    return getImageRatio(widthImage);
  }, [widthImage]);
  const [heightForText, setHeightForText] = useState(0);
  const onItemLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > heightForText) {
      setHeightForText(height);
    }
  };

  const onBookPress = (booId: string) => {
    navigation.navigate(RootStackName.EbookScreenDetail, { ebookId: booId });
  };

  const onMoreBookRecommended = () => {
    navigation.navigate(RootStackName.RecommedForYouScreen);
  };
  // render
  const renderItemBook: ListRenderItem<IBook> = ({ item }) => {
    return (
      <EbookItem2
        onLayout={onItemLayout}
        heightForText={heightForText}
        widthForImage={widthImage}
        heightForImage={heightForImage}
        item={item}
      />
    );
  };

  const renderListHeaderComponent = () => (
    <>
      <ListGenreSeries
        width={(width * 0.95 - PADDING_HORIZONTAL * 2 - 8) / 2}
        containerStyle={{ paddingHorizontal: PADDING_HORIZONTAL }}
        tileContainerStyle={{ paddingHorizontal: PADDING_HORIZONTAL }}
        title={translate(OtherTranslationKey.ExplorebyGenre)}
      />

      <ListBookHorizontal
        onMoreBookPress={onMoreBookRecommended}
        title={translate(OtherTranslationKey.RecommedForYou)}
        listData={recommendList}
        onBookPress={onBookPress}
        style={{ marginTop: 16 }}
        ListEmptyComponent={
          <View style={[{ width: width }, styles.recommendEmptyWrapper]}>
            <BookVerticalSkeleton widthImage={widthImage} />
            <BookVerticalSkeleton widthImage={widthImage} />
          </View>
        }
      />

      <Text
        style={[
          styles.text700,
          { marginHorizontal: 16, marginTop: 16, marginBottom: -10 },
        ]}>
        {translate(OtherTranslationKey.ExploreMore)}
      </Text>
    </>
  );

  if (loadingWhenRender) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}>
        <ActivityIndicator animating={true} color={colors.primary} />
      </View>
    );
  }
  return (
    <View style={[styles.container]}>
      <HomeHeader />
      <FlatList
        style={{ flex: 1 }}
        renderItem={renderItemBook}
        keyExtractor={(item, index) => item._id}
        data={bookList}
        extraData={bookList}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContentContainer}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        ListHeaderComponent={renderListHeaderComponent}
        ListFooterComponent={() => {
          if (!pagination.hasNext) {
            return null;
          }
          return <FooterListLoading />;
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={() => pagination.hasNext && handleLoadMore()}
        onEndReachedThreshold={3}
      />
    </View>
  );
};
export default HomeScreen;
const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    recommendEmptyWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text,
    },
    textCenter: {
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    text400: {
      color: colors.text,
      fontFamily: Popins[400],
      top: 1.8,
    },
    text500: {
      color: colors.text,
      fontFamily: Popins[500],
      top: 2,
    },
    text700: {
      fontSize: 16,
      color: colors.text,
      fontFamily: Popins[700],
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      rowGap: 20,
    },
  });
