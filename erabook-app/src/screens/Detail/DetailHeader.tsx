import {LayoutChangeEvent, StyleSheet, ToastAndroid, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {useNavigation} from '@react-navigation/native';
import {RootStackProps} from '@navigator/types';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppSelector} from '@redux/storeAndStorage/persist';
import {addWishlist, getWishlist, removeWishlist} from '@services/api.service';
import {FeatherIcons, FontAwesomeIcons} from '@utils/utils';
import {Pressable} from 'react-native';
import { useTranslation } from 'react-i18next';
import { RoutesTranslationKey } from '@translations/constants';
import { OtherTranslationKey } from 'translations/constants';
interface Props {
  onLayout?: (event: LayoutChangeEvent) => void;
}

const DetailHeader = ({onLayout}: Props) => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<RootStackProps>();
  const [listIcon, setListIcon] = useState(true);
  const ebook = useAppSelector(state => state.root.book.currentBook);
  const { t } = useTranslation(RoutesTranslationKey.ortherRoute);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        if (ebook?._id) {
          const wishlist = await getWishlist();
          const isBookInWishlist = wishlist.some(
            (item: IBook) => item._id === ebook._id,
          );
          if (isBookInWishlist) {
            setListIcon(false);
          }
        }
      } catch (error) {
        console.log('checkWishlistStatus error', error);
      }
    };

    checkWishlistStatus();
  }, [ebook?._id]);

  const setIcon = async () => {
    try {
      if (ebook?._id) {
        if (!listIcon) {
          await removeWishlist(ebook._id);
          const translatedMessage = t(OtherTranslationKey.Successfullyremovedfromfavoriteslist);
          ToastAndroid.show(translatedMessage, ToastAndroid.SHORT);
        } else {
          await addWishlist(ebook._id);
          const translatedMessage = t(OtherTranslationKey.Addedtowishlistsuccessfully);
          ToastAndroid.show(translatedMessage, ToastAndroid.SHORT);
        }
        setListIcon(!listIcon);
      }
    } catch (error) {
      console.log('fetchBook error', error);
      return null;
    }
  };

  return (
    <View
      onLayout={onLayout}
      style={[styles.header, {paddingTop: insets.top + 8}]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FeatherIcons name="arrow-left" style={styles.colorMain} size={26} />
      </TouchableOpacity>
      <View style={styles.social}>
        <Pressable onPress={setIcon}>
          {listIcon ? (
            <FeatherIcons
              name="file-minus"
              style={styles.colorMain}
              size={26}
            />
          ) : (
            <FeatherIcons
              name="file-plus"
              style={{color: '#F89300'}}
              size={26}
            />
          )}
        </Pressable>
        {/* <TouchableOpacity>
          <Icon
            name="send"
            style={[styles.colorMain, {marginStart: 25}]}
            size={26}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default DetailHeader;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    header: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      alignItems: 'center',
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    social: {
      flexDirection: 'row',
      height: 30,
    },
    colorMain: {
      color: colors.text,
    },
  });
