import {View} from 'react-native';
import React from 'react';
import {Skeleton} from 'moti/skeleton';
import {getImageRatio} from 'helper/string.helper';
import {darkTheme, useAppTheme} from '@themes/theme.config';

// const width = Dimensions.get('window').width;
const BookVerticalSkeleton = ({widthImage}: {widthImage: number}) => {
  // const widthImage = (width - 16 * 2 - 8) / 2;
  const {colors} = useAppTheme();
  const isDarkMode = colors.background === darkTheme.colors.background;
  return (
    <View>
      <Skeleton
        colorMode={isDarkMode ? 'dark' : 'light'}
        radius={16}
        height={getImageRatio(widthImage)}
        width={widthImage}
      />
      <View style={{height: 10}} />
      <Skeleton
        colorMode={isDarkMode ? 'dark' : 'light'}
        height={14}
        width={widthImage}
      />
      <View style={{height: 10}} />
      <Skeleton
        colorMode={isDarkMode ? 'dark' : 'light'}
        height={14}
        width={widthImage * 0.7}
      />
    </View>
  );
};

export default BookVerticalSkeleton;
