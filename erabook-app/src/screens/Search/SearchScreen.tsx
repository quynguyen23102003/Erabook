import {
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Popins } from '../../components/popins';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/Entypo';
import EbookItem2 from 'components/Item/EbookItem2';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderSearchScreen from './components/HeaderSearchScreen';
import { useTranslation } from 'react-i18next';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from 'translations/constants';
import { AppThemeColors, useAppTheme } from 'themes/theme.config';
import EbookItem3 from 'components/Item/EbookItem3';
import { EndPoint } from '@services/types';
import { callApi } from '@services/axios.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackName, RootStackParamList } from '@navigator/types';
import { LoadingLotteAnimation } from '@assets/Icon';
import { FooterListLoading } from '@components/loading/footerListLoading';

const { width } = Dimensions.get('window');
export const SearchScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const [data, setData] = useState<IBook[]>([]);
  const [isCheckItem, setIscheckItem] = useState(true);
  const [textSearch, setTextSearch] = useState('');
  const [listViewType, setListViewType] = useState(true);
  const [layout, setLayout] = useState<LayoutRectangle>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [stickyHeader, setStickyHeader] = useState(false);
  const { top } = useSafeAreaInsets();
  type HomeProps = RouteProp<RootStackParamList, RootStackName.SearchScreen>;
  const route = useRoute<HomeProps>();
  const genreParam = route.params?.genre || '';
  const selectedSort = route.params?.sort || '';
  const selectedAsc = route.params?.asc || '';
  const selectedfillter = route.params?.filter || '';
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const handleSearchTextChange = (textSearch: string) => {
    setTextSearch(textSearch);
  };
  const search = async (textSearch: string, nextPage: number) => {
    try {
      const { data: newData } = await callApi().get(EndPoint.searchBooks, {
        params: {
          search: textSearch ?? '',
          genre: genreParam ?? '',
          sort: selectedSort ?? '',
          asc: selectedAsc ?? '',
          filter: selectedfillter ?? '',
          page: nextPage,
          limit: 10,
        },
      });
      if (newData.length > 0) {
        setData(prevData => (nextPage === 1 ? newData : [...prevData, ...newData]));
        setPage(nextPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log('getBooks error', error);
    } finally {
      setLoadingMore(false);
    }
    return [];
  };
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingMore(true);
        await search(textSearch || '', 1);
      } finally {
        setLoadingMore(false);
      }
    };

    loadInitialData();
  }, [textSearch, genreParam, selectedSort, selectedAsc, selectedfillter]);

  useEffect(() => {
    const loadMoreData = async () => {
      if (!loadingMore && hasMore) {
        setLoadingMore(true);
        await search(textSearch || '', page);
      }
    };
    loadMoreData();
  }, [page]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      search(textSearch, page);
    }
  };
  const widthForImage = useMemo(() => {
    return (width - 58) / 2;
  }, []);
  const heightForImage = useMemo(() => {
    return (widthForImage * 17) / 11;
  }, [widthForImage]);
  const [heightForText, setHeightForText] = useState(0);
  const onItemLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > heightForText) {
      setHeightForText(height);
    }
  };
  const widthForImage2 = useMemo(() => {
    return (width - 58) / 3;
  }, []);
  const heightForImage2 = useMemo(() => {
    return (widthForImage * 12) / 11;
  }, [widthForImage]);
  const [heightForText2, setHeightForText2] = useState(0);
  const onItemLayout2 = (event: LayoutChangeEvent) => {
    const height2 = event.nativeEvent.layout.height;
    if (height2 > heightForText2) {
      setHeightForText2(height2);
    }
  };



  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);

  const renderItem = ({ item }: { item: IBook }) => {
    return listViewType ? (
      <EbookItem2
        key={item._id}
        onLayout={onItemLayout}
        heightForText={heightForText}
        widthForImage={widthForImage}
        heightForImage={heightForImage}
        item={item}
      />
    ) : (
      <EbookItem3
        key={item._id}
        onLayout={onItemLayout2}
        heightForText={heightForText2}
        widthForImage={widthForImage2}
        heightForImage={heightForImage2}
        item={item}
      />
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.groupTitle}>
        <Text style={styles.txtTitle}>
          {translate(OtherTranslationKey.Showin)}
        </Text>
        <View style={styles.iconTitle}>
          <TouchableOpacity
            onPress={() => {
              setListViewType(true);
              setIscheckItem(true);
            }}>
            {isCheckItem ? (
              <Icon3
                name="grid"
                style={{ color: '#f89300', marginRight: 15 }}
                size={28}
              />
            ) : (
              <Icon3
                name="grid"
                style={{ color: '#616161', marginRight: 15 }}
                size={28}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setListViewType(false);
              setIscheckItem(false);
            }}>
            {isCheckItem ? (
              <Icon2
                name="document-text"
                style={{ color: '#616161', marginRight: 0 }}
                size={20}
              />
            ) : (
              <Icon2
                name="document-text"
                style={{ color: '#f89300', marginRight: 0 }}
                size={20}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    console.log(stickyHeader);
  }, [stickyHeader]);

  return (
    <View style={[styles.container, { paddingTop: top + 6 }]}>
      {/* <MotiView
        animate={{
          opacity: stickyHeader ? 1 : 0,
          translateY: stickyHeader ? top : -layout.height * 4,
        }}
        transition={{
          type: 'timing',
          duration: 300,
          delay: 200,
        }}
        onLayout={event => {
          console.log('layout', event.nativeEvent.layout);
          layout.height == 0 && setLayout(event.nativeEvent.layout);
        }}
        style={[
          {
            width: '100%',
            paddingHorizontal: 16,
          },
          {
            paddingHorizontal: 16,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: colors.background,
          },
        ]}>
        <View style={{width: '100%'}}>
          <HeaderSearchScreen onSearchTextChange={handleSearchTextChange} />
        </View>
        {renderHeader()}
      </MotiView> */}
      <ScrollView
        // onScroll={event => {
        //   const e = event.nativeEvent;
        //   console.log(e.contentOffset.y);
        //   if (e.velocity?.y) {
        //     if (e.velocity.y > 10) {
        //       setStickyHeader(false);
        //     }
        //     if (e.velocity.y < -3) {
        //       setStickyHeader(true);
        //     }
        //   }
        // }}
        onScrollEndDrag={() => {
          handleLoadMore();
        }}
        // onEndReached={() => handleLoadMoreSearch()}
        onScroll={({ nativeEvent }) => {
          const offsetY = nativeEvent.contentOffset.y;
          const contentHeight = nativeEvent.contentSize.height;
          const screenHeight = nativeEvent.layoutMeasurement.height;
        }}
        overScrollMode="never"
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        accessibilityElementsHidden={true}
        contentContainerStyle={{
          flexWrap: 'wrap',
          flexDirection: listViewType ? 'row' : 'column',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        }}>
        <MotiView
          style={{
            width: '100%',
            backgroundColor: colors.background,
            zIndex: 100,
          }}>
          <HeaderSearchScreen onSearchTextChange={handleSearchTextChange} />
          <View
            onLayout={event => {
              layout.height == 0 && setLayout(event.nativeEvent.layout);
            }}
            style={[{ width: '100%' }]}>
            {renderHeader()}
          </View>
        </MotiView>
        {data.map((item, index) => {
          return renderItem({ item });
        })}
        <View style={{ 
          justifyContent: 'center',
           alignItems: "center", 
           width: "100%" 
           }}>
            {
              loadingMore ? (<FooterListLoading />) : (<View></View>)
            }
        </View>
      </ScrollView>
    </View>
  );
};

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    groupTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
    },
    txtTitle: {
      fontSize: 16,
      fontFamily: Popins[600],
      color: colors.text,
    },
    iconTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    listContentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 24,
      rowGap: 20,
    },
  });
