import {
  Dimensions,
  LayoutChangeEvent,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EbookItem2 from '../../components/Item/EbookItem2';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {AppHeader} from '@components/AppHeader';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import IconSearch from 'react-native-vector-icons/Feather';
import Feather from 'react-native-vector-icons/Feather';
import {callApi} from '@services/axios.service';
import {useNavigation} from '@react-navigation/native';
import {
  DiscoverBottomTabScreenProps,
  RootStackName,
  RootStackProps,
} from '@navigator/types';
import {
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import {useTranslation} from 'react-i18next';
import {Popins} from '@components/popins';
import {BookVerticalSkeleton} from '@components';
import { useAppSelector } from '@redux/storeAndStorage/persist';

interface ISections {
  title: OtherTranslationKey;
  dataKey: string;
}

const {width} = Dimensions.get('window');

const DiscoverScreen: React.FC = () => {
  const {genreList} = useAppSelector(state => state.root.genre);
  const [eBookData, setEBookData] = useState<{[key: string]: IBook[]}>({});
  const {colors} = useAppTheme();
  const navigation =
    useNavigation<DiscoverBottomTabScreenProps['navigation']>();
  const styles = useStyles(colors);
  const {t} = useTranslation(RoutesTranslationKey.ortherRoute);

  const sections: ISections[] = [
    {title: OtherTranslationKey.TopCharts, dataKey: 'topAll'},
    {title: OtherTranslationKey.TopSelling, dataKey: 'topSelling'},
    {title: OtherTranslationKey.TopFree, dataKey: 'topFree'},
    {title: OtherTranslationKey.TopNewReleases, dataKey: 'topNewReleases'},
  ];

  const fetchDataByDataKey = async (dataKey: string) => {
    let endpoint = '';

    switch (dataKey) {
      case 'topFree':
        endpoint = '/books/topFree';
        break;
      case 'topSelling':
        endpoint = '/books/topSelling';
        break;
      case 'topAll':
        endpoint = '/books/topAll';
        break;
      case 'topNewReleases':
        endpoint = '/books/topNewRelease';
        break;
      default:
        break;
    }

    try {
      const data: BookResponse | null = await callApi().get(endpoint, {
        params: {
          page: 1,
          limit: 10,
        },
      });

      if (data) {
        setEBookData(prevData => ({
          ...prevData,
          [dataKey]: data.data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching books for ${dataKey}:`, error);
    }
  };

  useEffect(() => {
    sections.forEach(section => {
      fetchDataByDataKey(section.dataKey).then();
    });
  }, []);

  const widthForImage = useMemo(() => {
    return (width - 58) / 2;
  }, []);
  const heightForImage = useMemo(() => {
    return (widthForImage * 17) / 11;
  }, []);
  const [heightForText, setHeightForText] = useState(0);
  const onItemLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > heightForText) {
      setHeightForText(height);
    }
  };

  const renderItemBook: ListRenderItem<IBook> = ({item}) => {
    return (
      <EbookItem2
        onLayout={onItemLayout}
        heightForText={heightForText}
        widthForImage={widthForImage}
        heightForImage={heightForImage}
        item={item}
      />
    );
  };

  const renderRightHeader = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(RootStackName.SearchScreen)}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <IconSearch name="search" style={{color: colors.text}} size={22} />
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title={t(OtherTranslationKey.Discover)}
        RightComponent={renderRightHeader}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 16}}>
        {sections.map((section, index) => (
          <View key={index}>
            <TouchableOpacity
              style={[
                styles.flexRow,
                styles.justifyBetween,
                {
                  marginTop: index === 0 ? 0 : 30,
                  marginBottom: 16,
                  alignItems: 'center',
                },
              ]}
              onPress={() =>
                navigation.navigate(RootStackName.DestinationScreen, {
                  title: section.title,
                  dataKey: section.dataKey,
                })
              }>
              <Text style={[styles.big_text]}>{t(section.title)}</Text>
              <Feather
                name="arrow-right"
                style={{color: colors.primary}}
                size={26}
              />
            </TouchableOpacity>
            {eBookData[section.dataKey] &&
            eBookData[section.dataKey].length > 0 ? (
              <FlatList
                horizontal
                data={eBookData[section.dataKey]}
                renderItem={renderItemBook}
                contentContainerStyle={{gap: 12}}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <View style={[{width: width, gap: 16}, styles.listEmptyWrapper]}>
                <BookVerticalSkeleton widthImage={widthForImage} />
                <BookVerticalSkeleton widthImage={widthForImage} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default DiscoverScreen;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    listEmptyWrapper: {
      flexDirection: 'row',
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    flexRow: {
      flexDirection: 'row',
    },
    justifyBetween: {
      justifyContent: 'space-between',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    big_text: {
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 16,
      color: colors.text,
      fontFamily: Popins[600],
    },
  });
