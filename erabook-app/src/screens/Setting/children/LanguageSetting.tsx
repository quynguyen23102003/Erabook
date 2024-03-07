import {ListRenderItem, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  AccountScreenTranslationKey,
  LanguageKey,
  OtherTranslationKey,
  RoutesTranslationKey,
} from '@translations/constants';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import HeaderComponents from '../components/HeaderComponents';
import {Popins} from '@components/popins';
import CheckBoxLanguage from '../components/CheckBoxLanguage';
import {FlatList} from 'react-native-gesture-handler';
import i18next from 'i18next';
import {changeLanguage} from '@utils/setting.language.utils';

export interface titleLanguage {
  title: string;
  keyCode: LanguageKey;
}

const LanguageSetting: React.FC = () => {
  const currentLanguage = i18next.language as LanguageKey;
  const {t: translate1} = useTranslation(RoutesTranslationKey.accountRoute);
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);
  const DataSuggested: titleLanguage[] = [
    {
      title: translate(OtherTranslationKey.English),
      keyCode: LanguageKey.English,
    },
    {
      title: translate(OtherTranslationKey.Vietnamese),
      keyCode: LanguageKey.Vietnamese,
    },
  ];

  const onChangeLanguagePress = async (keyCode: LanguageKey) => {
    await changeLanguage(keyCode);
  };
  const renderItem: ListRenderItem<titleLanguage> = ({item}) => {
    return (
      <Pressable onPress={() => onChangeLanguagePress(item.keyCode)}>
        <CheckBoxLanguage item={item} selectedKeyCode={currentLanguage} />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponents
        title={translate1(AccountScreenTranslationKey.Language)}
      />
      <View style={styles.groupSuggested}>
        <Text style={styles.title}>
          {translate(OtherTranslationKey.Suggested)}
        </Text>
        <FlatList
          data={DataSuggested}
          renderItem={renderItem}
          keyExtractor={item => item.title}
        />
      </View>
      {/* <View style={styles.groupLanguage}>
        <Text style={styles.title}>
          {translate(OtherTranslationKey.Language)}
        </Text>
        <FlatList
          data={DataLanguage}
          renderItem={renderItem}
          keyExtractor={item => item.title}
        />
      </View> */}
    </View>
  );
};

export default LanguageSetting;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    title: {
      fontFamily: Popins[600],
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
    },
    groupSuggested: {
      marginHorizontal: 16,
      paddingTop: 16,
      // borderBottomWidth: 1,
      borderBottomColor: colors.backgroundCategory,
    },
    groupLanguage: {
      marginHorizontal: 16,
      paddingVertical: 16,
    },
  });

// const DataLanguage: titleLanguage[] = [
//   {
//     title: 'Mandarin',
//   },
//   {
//     title: 'Hindi',
//   },
//   {
//     title: 'Spanish',
//   },
//   {
//     title: 'Fench',
//   },
//   {
//     title: 'Arabic',
//   },
//   {
//     title: 'Bengali',
//   },
//   {
//     title: 'Russian',
//   },
//   {
//     title: 'Indonesia',
//   },
// ];
