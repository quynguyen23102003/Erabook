import {View} from 'react-native';
import React from 'react';
import {Skeleton} from 'moti/skeleton';
import {darkTheme, useAppTheme} from '@themes/theme.config';

const BookHorizontalSkeleton = ({heightForImage}: {heightForImage: number}) => {
  const {colors} = useAppTheme();
  const isDarkMode = colors.background === darkTheme.colors.background;
  return (
    <View style={{flexDirection: 'row', gap: 10}}>
      <Skeleton
        colorMode={isDarkMode ? 'dark' : 'light'}
        radius={16}
        height={heightForImage}
        width={(heightForImage * 3) / 4}
      />
      <View style={{flex: 1}}>
        <View style={{height: 10}} />
        <Skeleton
          colorMode={isDarkMode ? 'dark' : 'light'}
          height={14}
          width={'80%'}
        />
        <View style={{height: 10}} />
        <Skeleton
          colorMode={isDarkMode ? 'dark' : 'light'}
          height={14}
          width={'70%'}
        />
        <View style={{height: 10}} />
        <Skeleton
          colorMode={isDarkMode ? 'dark' : 'light'}
          height={14}
          width={'50%'}
        />
      </View>
    </View>
  );
};

export default BookHorizontalSkeleton;
