import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { Popins } from '../popins';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import { AppThemeColors, useAppTheme } from 'themes/theme.config';
import { useNavigation } from '@react-navigation/native';
import { RootStackName, RootStackProps } from '@navigator/types';
import { useTranslation } from 'react-i18next';
import { RoutesTranslationKey, OtherTranslationKey } from '@translations/constants';

export interface ItemBookProps {
  item: IBook;
  widthForImage: number;
  heightForImage: number;
  onLayout: (event: LayoutChangeEvent) => void;
  heightForText: number;
}
// const uri =
//   'https://image.tmdb.org/t/p/original/49XUh6kIalLvbawnVwe6qQ12mVi.jpg';
const EbookItem2: React.FC<ItemBookProps> = ({
  widthForImage,
  heightForImage,
  heightForText,
  onLayout,
  item,
}) => {
  const onItemLayout = (event: LayoutChangeEvent) => {
    onLayout && onLayout(event);
  };
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<RootStackProps>();
  const { t } = useTranslation(RoutesTranslationKey.ortherRoute);
  const onPressDetail = () => {
    console.log('onPressDetail');
    navigation.navigate(RootStackName.EbookScreenDetail, { ebookId: item._id });
  };
  return (
    <Pressable
      onPress={onPressDetail}
      style={[styles.container, { width: widthForImage }]}>
      {/* <View style={{ width: widthForImage, height: heightForImage, borderRadius: 16, borderWidth: 1, overflow:'hidden' }} /> */}
      <Image
        source={{ uri: item.coverImage }}
        style={{
          width: widthForImage,
          height: heightForImage,
          borderRadius: 16,
          overflow: 'hidden',
        }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View
          style={{
            // paddingHorizontal: 4,
            marginTop: 6,
            flex: 1,
          }}>
          <Text
            onLayout={onItemLayout}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              styles.textTitle,
              // heightForText > 0 && {height: heightForText},
            ]}>
            {item.title}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {
            item.price === 0 || item.price === null
              ? (
                <Text style={styles.text500}>
                  {t(OtherTranslationKey.Free)}
                </Text>
              ) : (
                <Text style={styles.text500}>
                  $ {parseFloat(item.price?.toString() || '0').toFixed(1)}
                </Text>
              )
          }
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon1 name="star-half-empty" style={styles.icon} size={16} />
            <Text style={[styles.text500]}>
              {item.rating.average.toFixed(1) || 0}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
export default EbookItem2;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 0,
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text,
    },
    textCenter: {
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    text500: {
      color: colors.text,
      fontFamily: Popins['600'],
      // top: 2,
      fontSize: 18,
    },
    textTitle: {
      color: colors.text,
      fontFamily: Popins['500'],
      top: 2,
      fontSize: 16,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      color: colors.text,
      marginBottom: 4,
    },
  });
