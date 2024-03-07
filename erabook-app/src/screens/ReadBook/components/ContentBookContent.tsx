import {useAppTheme} from '@themes/theme.config';
import {Popins} from 'components/popins';
import React from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {FontFamilyType, TextAlignType} from '../ReadbookScreen';

interface ContentProps {
  contentText: string;
  textAlign: TextAlignType;
  fontSize: number;
  fontFamily: FontFamilyType;
}

const ContentBookContent: React.FC<ContentProps> = ({
  contentText,
  textAlign,
  fontSize,
  fontFamily,
}) => {
  console.log('ContentBookContent');
  const {colors} = useAppTheme();
  return (
    <View style={[styles.container, {flex: 1}]}>
      <ScrollView overScrollMode={'never'} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.text400,
            {
              textAlign: textAlign,
              color: colors.text,
              fontSize: fontSize,
              fontFamily: fontFamily,
              lineHeight: 1.75 * fontSize,
            },
          ]}>
          {contentText}
        </Text>
        <View style={{width: '100%', height: 30}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  text400: {
    color: '#192e51',
    fontFamily: Popins[400], // You can adjust the font family as needed
    fontSize: 16,
    lineHeight: 1.75 * 16,
  },
});

export default ContentBookContent;
