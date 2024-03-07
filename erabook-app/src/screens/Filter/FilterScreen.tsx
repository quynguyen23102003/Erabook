import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { useTranslation } from 'react-i18next';
import { OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import HeaderFilter from './components/HeaderFilter';
import CheckBoxFilter from './components/CheckBoxFilter';
import { Popins } from '@components/popins';
import RadioFilter from './components/RadioFilter';
import { useAppSelector } from '@redux/storeAndStorage/persist';
import { useNavigation } from '@react-navigation/native';
import { RootStackName, RootStackProps } from '@navigator/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RangeSlider from './components/RangeSlider';
import MultiFilter from './components/MultiFilter';
import { ButtonText } from '@components';

const DataSort = [
  {
    title: 'lastUpdated',
    key: OtherTranslationKey.lastUpdated
  },
  {
    title: 'createdAt',
    key: OtherTranslationKey.createdAt
  },
  {
    title: 'viewCount',
    key: OtherTranslationKey.viewCount
  },
  {
    title: 'pageCount',
    key: OtherTranslationKey.pageCount
  },
  {
    title: 'price',
    key: OtherTranslationKey.Price
  },
]

const DataAsc = [
  {
    title: 'y',
    key: OtherTranslationKey.Pricesgraduallyincrease
  },
  {
    title: '',
    key: OtherTranslationKey.Pricesgraduallydecrease
  }
]
export const clearAllFilterData = async () => {
  try {
    await AsyncStorage.removeItem('minPrice');
    await AsyncStorage.removeItem('maxPrice');
    // Xóa dữ liệu cho các filters khác
    await AsyncStorage.removeItem('selectedGenres');
    await AsyncStorage.removeItem('selectedSort');
    await AsyncStorage.removeItem('selectedAsc');
  } catch (error) {
    console.error('Error clearing all filter data:', error);
  }
};
const Width = Dimensions.get('window').width;
const calculatedSliderWidth = Width - 64;
const WidthButton = Dimensions.get('window').width;
const buttonWidth = (WidthButton - 48) / 2;
const FilterScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const styles = useStyle(colors);
  const navigation = useNavigation<RootStackProps>();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30);

  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);

  const [minPagecount, setMinPagecount] = useState(0);
  const [maxPagecount, setMaxPagecount] = useState(50);

  const [minPurchasecount, setMinPurchasecount] = useState(0);
  const [maxPurchasecount, setMaxPurchasecount] = useState(30);

  const handlePriceChange = (range: { min: number; max: number }) => {
    setMinPrice(range.min);
    setMaxPrice(range.max);

    console.log(`Price Filter - Min: ${range.min}, Max: ${range.max}`);
  };

  const handleRatingChange = (range: { min: number; max: number }) => {
    setMinRating(range.min);
    setMaxRating(range.max);

    console.log(`Rating Filter - Min: ${range.min}, Max: ${range.max}`);
  };

  const handlePagecountChange = (range: { min: number; max: number }) => {
    setMinPagecount(range.min);
    setMaxPagecount(range.max);

    console.log(`Pagecount Filter - Min: ${range.min}, Max: ${range.max}`);
  };

  const handlePurchasecountChange = (range: { min: number; max: number }) => {
    setMinPurchasecount(range.min);
    setMaxPurchasecount(range.max);

    console.log(`Purchasecount Filter - Min: ${range.min}, Max: ${range.max}`);
  };
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const genreList = useAppSelector((state) => state.root.genre.genreList);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const handleGenreSelect = (genreId: string, selected: boolean) => {
    setSelectedGenres((prevSelectedGenres) => {
      if (selected) {
        return [...prevSelectedGenres, genreId];
      } else {
        return prevSelectedGenres.filter((id) => id !== genreId);
      }
    });
  };

  const [selectedSort, setSelectedSort] = React.useState<string | null>(null);

  const handleSortSelect = (sort: string) => {
    setSelectedSort((prevSort) => (prevSort === sort ? null : sort));
  };
  const [selectedAsc, setSelectedAsc] = React.useState<string | null>(null);

  const handleAscSelect = (asc: string) => {
    setSelectedAsc((prevAsc) => (prevAsc === asc ? null : asc));
  };
  useEffect(() => {
    const getSelectedGenresFromStorage = async () => {
      try {
        const storedGenres = await AsyncStorage.getItem('selectedGenres');
        if (storedGenres) {
          const parsedGenres = JSON.parse(storedGenres);
          setSelectedGenres(parsedGenres);
        }
      } catch (error) {
        console.error('Error retrieving selected genres from AsyncStorage:', error);
      }
    };

    getSelectedGenresFromStorage();
  }, []);

  useEffect(() => {
    const saveSelectedGenresToStorage = async () => {
      try {
        await AsyncStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
      } catch (error) {
        console.error('Error saving selected genres to AsyncStorage:', error);
      }
    };

    saveSelectedGenresToStorage();
  }, [selectedGenres]);

  useEffect(() => {
    const getSelectedSortFromStorage = async () => {
      try {
        const storedSort = await AsyncStorage.getItem('selectedSort');
        if (storedSort !== null) {
          setSelectedSort(storedSort);
        }
      } catch (error) {
        console.error('Error retrieving selected sort from AsyncStorage:', error);
      }
    };

    getSelectedSortFromStorage();
  }, []);

  useEffect(() => {
    const saveSelectedSortToStorage = async () => {
      try {
        await AsyncStorage.setItem('selectedSort', selectedSort || '');
      } catch (error) {
        console.error('Error saving selected sort to AsyncStorage:', error);
      }
    };

    saveSelectedSortToStorage();
  }, [selectedSort]);


  useEffect(() => {
    const getSelectedAscFromStorage = async () => {
      try {
        const storedAsc = await AsyncStorage.getItem('selectedAsc');
        if (storedAsc !== null) {
          setSelectedAsc(storedAsc);
        }
      } catch (error) {
        console.error('Error retrieving selected asc from AsyncStorage:', error);
      }
    };

    getSelectedAscFromStorage();
  }, []);

  useEffect(() => {
    const saveSelectedAscToStorage = async () => {
      try {
        await AsyncStorage.setItem('selectedAsc', selectedAsc || '');
      } catch (error) {
        console.error('Error saving selected asc to AsyncStorage:', error);
      }
    };

    saveSelectedAscToStorage();
  }, [selectedAsc]);

  const handleApplyFilters = () => {
    const genreParam = selectedGenres.join(',');
    const filters = [];

    // Add price filter if applicable
    if (minPrice !== 0 || maxPrice !== 30) {
      filters.push(`price>=${minPrice},price<=${maxPrice}`);
    }

    // Add rating filter if applicable
    if (minRating !== 0 || maxRating !== 5) {
      filters.push(`rating>=${minRating},rating<=${maxRating}`);
    }

    // Add pagecount filter if applicable
    if (minPagecount !== 0 || maxPagecount !== 50) {
      filters.push(`pageCount>=${minPagecount},pageCount<=${maxPagecount}`);
    }

    // Add purchasecount filter if applicable
    if (minPurchasecount !== 0 || maxPurchasecount !== 30) {
      filters.push(`purchaseCount>=${minPurchasecount},purchaseCount<=${maxPurchasecount}`);
    }

    // Combine filters into a single string
    const filterString = filters.length > 0 ? `${filters.join(',')}` : '';
    navigation.navigate(RootStackName.SearchScreen, {
      genre: genreParam,
      sort: selectedSort !== null ? selectedSort : '',
      asc: selectedAsc !== null ? selectedAsc : '',
      ...(filterString && { filter: filterString }),
    });
    // saveFilterToStorage('minPrice', minPrice);
    // saveFilterToStorage('maxPrice', maxPrice);
    // saveFilterToStorage('minRating', minRating);
    // saveFilterToStorage('maxRating', maxRating);
    // saveFilterToStorage('minPagecount', minPagecount);
    // saveFilterToStorage('maxPagecount', maxPagecount);
    // saveFilterToStorage('minPurchasecount', minPurchasecount);
    // saveFilterToStorage('maxPurchasecount', maxPurchasecount);
  };

  // const saveFilterToStorage = async (key: string, value: number) => {
  //   try {
  //     await AsyncStorage.setItem(key, value.toString());
  //   } catch (error) {
  //     console.error(`Error saving ${key} to AsyncStorage:`, error);
  //   }
  // };
  // useEffect(() => {
  //   // ... existing code ...

  //   // Retrieve and set initial values from AsyncStorage
  //   const getFilterFromStorage = async (key: string) => {
  //     try {
  //       const storedValue = await AsyncStorage.getItem(key);
  //       if (storedValue !== null) {
  //         const parsedValue = parseFloat(storedValue);
  //         switch (key) {
  //           case 'minPrice':
  //             setMinPrice(parsedValue);
  //             break;
  //           case 'maxPrice':
  //             setMaxPrice(parsedValue);
  //             break;
  //           case 'minRating':
  //             setMinRating(parsedValue);
  //             break;
  //           case 'maxRating':
  //             setMaxRating(parsedValue);
  //             break;
  //           case 'minPagecount':
  //             setMinPagecount(parsedValue);
  //             break;
  //           case 'maxPagecount':
  //             setMaxPagecount(parsedValue);
  //             break;
  //           case 'minPurchasecount':
  //             setMinPurchasecount(parsedValue);
  //             break;
  //           case 'maxPurchasecount':
  //             setMaxPurchasecount(parsedValue);
  //             break;
  //           default:
  //             break;
  //         }
  //       }
  //     } catch (error) {
  //       console.error(`Error retrieving ${key} from AsyncStorage:`, error);
  //     }
  //   };

  //   // Retrieve and set initial values for each filter
  //   getFilterFromStorage('minPrice');
  //   getFilterFromStorage('maxPrice');
  //   getFilterFromStorage('minRating');
  //   getFilterFromStorage('maxRating');
  //   getFilterFromStorage('minPagecount');
  //   getFilterFromStorage('maxPagecount');
  //   getFilterFromStorage('minPurchasecount');
  //   getFilterFromStorage('maxPurchasecount');

  //   // ... existing code ...
  // }, []);

  const handleResetFilters = () => {
    setSelectedGenres([]);
    setSelectedAsc(null);
    setSelectedSort(null);
    setMinPrice(0);
    setMinRating(0);
    setMinPagecount(0);
    setMinPurchasecount(0);
    setMaxPrice(30);
    setMaxRating(5);
    setMaxPagecount(50);
    setMaxPurchasecount(30);
  };
  return (
    <View style={styles.container}>
      <HeaderFilter />
      <ScrollView style={{ marginBottom: 104 }}>
        <View style={[styles.groupContent, { paddingBottom: 16 }]}>
          <Text style={[styles.title, { borderBottomColor: colors.backgroundCategory, borderBottomWidth: 2 }]}>{translate(OtherTranslationKey.Price)}</Text>
          <MultiFilter sliderWidth={calculatedSliderWidth} min={minPrice} max={30} step={1}
            onValueChange={(range) => handlePriceChange(range)}
          />
        </View>
        <View style={[styles.groupContent, { paddingBottom: 16 }]}>
          <Text style={[styles.title, { borderBottomColor: colors.backgroundCategory, borderBottomWidth: 2 }]}>{translate(OtherTranslationKey.Rating)}</Text>
          <MultiFilter sliderWidth={calculatedSliderWidth} min={minRating} max={5} step={1}
            onValueChange={(range) => handleRatingChange(range)}
          />
        </View>
        <View style={[styles.groupContent, { paddingBottom: 16 }]}>
          <Text style={[styles.title, { borderBottomColor: colors.backgroundCategory, borderBottomWidth: 2 }]}>{translate(OtherTranslationKey.Pagecount)}</Text>
          <MultiFilter sliderWidth={calculatedSliderWidth} min={minPagecount} max={50} step={1}
            onValueChange={(range) => handlePagecountChange(range)}
          />
        </View>
        <View style={[styles.groupContent, { paddingBottom: 16 }]}>
          <Text style={[styles.title, { borderBottomColor: colors.backgroundCategory, borderBottomWidth: 2 }]}>{translate(OtherTranslationKey.Purchasecount)}</Text>
          <MultiFilter sliderWidth={calculatedSliderWidth} min={minPurchasecount} max={30} step={1}
            onValueChange={(range) => handlePurchasecountChange(range)}
          />
        </View>
        <View style={styles.groupContent}>
          <Text style={styles.title}>{translate(OtherTranslationKey.Sort)}</Text>
          {
            DataSort.map((item, index) => (
              <CheckBoxFilter
                key={index}
                title={item.key}
                selected={selectedSort === item.title}
                onPress={() => handleSortSelect(item.title)}
              />
            ))
          }
        </View>
        <View style={styles.groupContent}>
          <Text style={styles.title}>{translate(OtherTranslationKey.Arrange)}</Text>
          {
            DataAsc.map((item, index) => (
              <CheckBoxFilter
                key={index}
                title={item.key}
                selected={selectedAsc === item.title}
                onPress={() => handleAscSelect(item.title)}
              />
            ))
          }
        </View>
        <View style={[styles.groupContent, { marginBottom: 24 }]}>
          <Text style={styles.title}>{translate(OtherTranslationKey.Genre)}</Text>
          {
            genreList.map((item) => (
              <RadioFilter
                key={item._id}
                title={item.name}
                onSelect={(selected) => handleGenreSelect(item._id, selected)}
                initialChecked={selectedGenres.includes(item._id)}
              />
            ))
          }
        </View>
      </ScrollView>
      <View style={styles.groupBtn}>
        <ButtonText
          containerStyle={[styles.btn, { marginRight: 16, backgroundColor: colors.secondary }]}
          onPress={() => handleResetFilters()}
          labelStyle={{ color: colors.primary }}
          label={translate(OtherTranslationKey.Reset)}
        />
        <ButtonText
          containerStyle={styles.btn}
          onPress={() => handleApplyFilters()}
          labelStyle={styles.text600}
          label={translate(OtherTranslationKey.Apply)}
        />
      </View>
    </View>
  )
}

export default FilterScreen

const useStyle = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 16,
    fontFamily: Popins[600],
    color: colors.text,
    marginBottom: 10
  },
  groupContent: {
    marginTop: 16,
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 15,
    backgroundColor: colors.googleButton,
    borderColor: colors.backgroundCategory,
    borderWidth: 2,
    elevation: 0.5,
  },
  groupBtn: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.backgroundCategory,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    // flex: 1,
    width: buttonWidth
  },
  text600: {
    color: '#ffffff',
    fontFamily: Popins[600],
    fontSize: 16,
    marginLeft: 8
  },
})