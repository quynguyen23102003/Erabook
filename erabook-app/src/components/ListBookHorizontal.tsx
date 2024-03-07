import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import React, {ReactNode} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Popins} from '@components/popins';
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {FeatherIcons, FontAwesomeIcons} from '@utils/utils';
import {getImageRatio} from 'helper/string.helper';

interface ListBookHorizontalProps {
  listData: IBook[];
  title: string;
  style?: StyleProp<ViewStyle>;
  onBookPress: (bookId: string) => void;
  onMoreBookPress:
    | (((event: GestureResponderEvent) => void) & (() => void))
    | undefined;
  ListEmptyComponent?: ReactNode;
}

const {width} = Dimensions.get('window');
export const ListBookHorizontal: React.FC<ListBookHorizontalProps> = ({
  listData,
  title,
  onMoreBookPress,
  style,
  onBookPress,
  ListEmptyComponent,
}) => {
  const {colors} = useAppTheme();
  const styles = useStyles(colors);

  const imageWidth = (width * 0.9 - 16 * 2 - 8) / 2;
  const imageHeight = getImageRatio(imageWidth);
  const renderItem = ({item}: {item: IBook}) => {
    return (
      <Pressable
        key={item._id + title}
        style={{width: imageWidth, height: '100%'}}
        onPress={() => onBookPress(item._id)}>
        {/* book image */}
        <Image
          source={{uri: item.coverImage}}
          style={{
            width: imageWidth,
            height: imageHeight,
            borderRadius: 16,
            overflow: 'hidden',
          }}
          resizeMode="cover"
        />

        {/* desc */}
        <View
          style={{
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <Text
            numberOfLines={2}
            style={[styles.textTitle, {marginTop: 6, flex: 1}]}>
            {item.title}
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
            <Text style={styles.text500}>
              $ {parseFloat(item.price?.toString() || '0').toFixed(1)}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <FontAwesomeIcons
                name="star-half-empty"
                style={styles.icon}
                size={16}
              />
              <Text style={[styles.text500]}>
                {item.rating.average.toFixed(1) || 0}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[{flexDirection: 'row'}, style]}>
      <View style={{rowGap: 8, flex: 1}}>
        {/* list header */}
        <TouchableOpacity onPress={onMoreBookPress} style={[styles.header]}>
          <Text style={[styles.textMedium700]}>{title}</Text>
          <View>
            <FeatherIcons
              name="arrow-right"
              style={{color: colors.primary}}
              size={26}
            />
          </View>
        </TouchableOpacity>

        {/* list */}
        {listData.length > 0 ? (
          <ScrollView
            contentContainerStyle={styles.scrollViewContentContainerStyle}
            overScrollMode={'never'}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {listData.slice(0, 10).map(item => renderItem({item}))}
          </ScrollView>
        ) : (
          ListEmptyComponent
        )}
      </View>
    </View>
  );
};

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    scrollViewContentContainerStyle: {
      paddingHorizontal: 16,
      alignItems: 'center',
      gap: 12,
    },
    textTitle: {
      color: colors.text,
      fontFamily: Popins['500'],
      top: 2,
      fontSize: 16,
    },
    textMedium700: {
      fontSize: 16,
      color: colors.text,
      fontFamily: Popins[700],
    },
    text500: {
      color: colors.text,
      fontFamily: Popins['600'],
      // top: 2,
      fontSize: 18,
    },
    icon: {
      color: colors.text,
      marginBottom: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },
  });
