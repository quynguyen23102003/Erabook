import React, {memo} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Popins} from '../../../components/popins';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {useNavigation} from '@react-navigation/native';
import {
  ArtDesignIcons,
  FeatherIcons,
  MaterialCommunityIcons,
} from '@utils/utils';

interface HeaderProps {
  title: string;
}

const HeaderBookContent: React.FC<HeaderProps> = ({title}) => {
  // console.log('HeaderBookContent');
  const navigation = useNavigation();
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  const onBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <ArtDesignIcons name="arrowleft" style={styles.colorMain} size={24} />
      </TouchableOpacity>
      <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <View style={styles.iconContainer}>
        <ArtDesignIcons name="search1" style={styles.colorMain} size={24} />
        <FeatherIcons
          name="mic"
          style={[styles.colorMain, styles.iconMargin]}
          size={24}
        />
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          style={styles.colorMain}
          size={24}
        />
      </View>
    </View>
  );
};

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 10,
      paddingVertical: 12,
    },
    backButton: {
      flex: 0,
    },
    title: {
      fontFamily: Popins[700],
      color: colors.text,
      fontSize: 16,
      flex: 1,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flex: 0,
    },
    colorMain: {
      color: colors.text,
    },
    iconMargin: {
      marginHorizontal: 12,
    },
  });

export default memo(HeaderBookContent);
