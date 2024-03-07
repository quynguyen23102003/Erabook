import { Dimensions, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackName, RootStackParamList, RootStackProps } from '@navigator/types';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import IconSearch from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';
import EbookItem2 from '@components/Item/EbookItem2';
import EbookItem3 from '@components/Item/EbookItem3';
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/Entypo";
import { Popins } from '@components/popins';
import { AppHeader } from '@components/AppHeader';
import { callApi } from '@services/axios.service';

const { width } = Dimensions.get('screen');
const DestinationScreen: React.FC = () => {
    const { colors } = useAppTheme();
    const navigation = useNavigation<RootStackProps>();
    const styles = useStyles(colors);
    type HomeProps = RouteProp<RootStackParamList, RootStackName.DestinationScreen>;
    const route = useRoute<HomeProps>();
    const [data, setData] = useState<IBook[]>([]);
    const [isCheckItem, setIscheckItem] = useState(true);
    const [listViewType, setListViewType] = useState(true);
    const [stickyHeader, setStickyHeader] = useState(false);
    const onPressSearch = () => {
        navigation.navigate(RootStackName.SearchScreen);
    }
    const renderRight = () => {
        return (
            <TouchableOpacity style={styles.center} onPress={onPressSearch}>
                <IconSearch name="search" style={styles.icon} size={24} />
            </TouchableOpacity>
        );
    }
    const renderLeft = () => {
        return (
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <IconSearch name="arrow-left" style={styles.icon} size={24} />
            </TouchableOpacity>
        );
    }
    const widthForImage = useMemo(() => {
        return (width - 58) / 2;
    }, [])
    const heightForImage = useMemo(() => {
        return (widthForImage * 17) / 11
    }, [])
    const [heightForText, setHeightForText] = useState(0);
    const onItemLayout = (event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height;
        if (height > heightForText) {
            setHeightForText(height);
        }
    }

    const widthForImage2 = useMemo(() => {
        return (width - 58) / 3;
    }, [])
    const heightForImage2 = useMemo(() => {
        return (widthForImage * 12) / 11
    }, [])
    const [heightForText2, setHeightForText2] = useState(0);
    const onItemLayout2 = (event: LayoutChangeEvent) => {
        const height2 = event.nativeEvent.layout.height;
        if (height2 > heightForText2) {
            setHeightForText2(height2);
        }
    }  

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
          const {data} = await callApi().get(endpoint, {
            params: {
              page: 1,
              limit: 10,
            },
          });
          if (data) {
            setData(data);
        } else {
            console.log('Không có dữ liệu');
        }
        } catch (error) {
          console.error(`Error fetching books for ${dataKey}:`, error);
        }
      };
    
      useEffect(() => {
          fetchDataByDataKey(route.params.dataKey).then();
      }, [route.params.dataKey]);

    const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);

    const renderItem = ({ item }: { item: IBook }) => {
        return (
          listViewType ?
            <EbookItem2
              key={item._id}
              onLayout={onItemLayout}
              heightForText={heightForText}
              widthForImage={widthForImage}
              heightForImage={heightForImage}
              item={item} /> :
            <EbookItem3
              key={item._id}
              onLayout={onItemLayout2}
              heightForText={heightForText2}
              widthForImage={widthForImage2}
              heightForImage={heightForImage2} item={item} />
        );
    };

    const renderHeader = () => {
        return (
          <View style={styles.groupTitle}>
              <Text style={styles.txtTitle}>{translate(OtherTranslationKey.Showin)}</Text>
              <View style={styles.iconTitle}>
                  <TouchableOpacity onPress={() => {
                      setListViewType(true);
                      setIscheckItem(true);  
                  }}>
                      {isCheckItem ? (
                        <Icon3 name="grid" style={{ color: "#f89300", marginRight: 15 }} size={28} />) : (
                        <Icon3 name="grid" style={{ color: "#616161", marginRight: 15 }} size={28} />)}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setListViewType(false);
                    setIscheckItem(false);
                  }}>
                      {isCheckItem ? (
                        <Icon2 name="document-text" style={{ color: "#616161", marginRight: 0 }} size={20} />) : (
                        <Icon2 name="document-text" style={{ color: "#f89300", marginRight: 0 }} size={20} />)}
                  </TouchableOpacity>
              </View>
          </View>
        );
    }

    useEffect(() => {
        console.log(stickyHeader);
    }, [stickyHeader]);
    return (
        <View style={styles.container}>
            <View style={{ width: "100%" }}>
            <AppHeader
                LeftComponent={renderLeft}
                RightComponent={renderRight}
                title={translate(route.params.title)}
            />
            </View>
            {renderHeader()}
        <ScrollView
          onScroll={(event) => {
              const e = event.nativeEvent;
              console.log(e.contentOffset.y);
              if (e.velocity?.y) {
                  if (e.velocity.y > 10) {
                      setStickyHeader(false);
                  }
                  if (e.velocity.y < -3) {
                      setStickyHeader(true);
                  }
              }
          }}
          accessibilityElementsHidden={true}
          contentContainerStyle={{
              flexWrap: "wrap",
              flexDirection: listViewType ? "row" : "column",
              justifyContent: "space-between",
              paddingHorizontal: 16
          }}
        >
            <View
              style={{ width: "100%"}}
            >
            </View>
            {
                data.map((item, index) => {
                    return renderItem({ item });
                })
            }
        </ScrollView>
      </View>
    )
}

export default DestinationScreen

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    icon: {
        color: colors.text
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 4
    },
    groupTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16
    },
    txtTitle: {
        fontSize: 16,
        fontFamily: Popins[600],
        color: colors.text
    },
    iconTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
})