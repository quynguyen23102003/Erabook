import React from 'react';
import {Text, View} from 'react-native';
import {useAppTheme} from '@themes/theme.config';
import {Popins} from '@components/popins';

interface ItemCategoryProps {
  index: number;
  title: string;
}

export const GenresItem: React.FC<ItemCategoryProps> = ({...props}) => {
  const {colors} = useAppTheme();
  return (
    <View
      style={{
        backgroundColor: colors.backgroundCategory,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        padding: 6,
      }}>
      <Text
        style={{
          fontSize: 10,
          color: colors.textDescription,
          fontFamily: Popins['400'],
        }}>
        {props.title}
      </Text>
    </View>
  );
};
