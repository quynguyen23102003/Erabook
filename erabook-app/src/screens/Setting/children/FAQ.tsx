import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import ItemDropdown, { IDropdown } from '../components/ItemDropdown';
import { OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

const dataDropdown: IDropdown[] = [
  {
    title: OtherTranslationKey.WhatisErabook,
    description: OtherTranslationKey.descriptionWhatisErabook,
  },
  {
    title: OtherTranslationKey.HowtopurchaseanEbook,
    description: OtherTranslationKey.descriptionHowtopurchaseanEbook,
  },
  {
    title: OtherTranslationKey.Howtoaddapaymentmethod,
    description: OtherTranslationKey.descriptionHowtoaddapaymentmethod,
  },
  {
    title: OtherTranslationKey.HowtocloseanEbookacount,
    description: OtherTranslationKey.descriptionHowtocloseanEbookacount,
  },
]

const FAQ: React.FC = () => {
  const [isFocus, setIsFocus] = useState(false);
  const { colors } = useAppTheme();
  const [data, setData] = useState(dataDropdown);
  const styles = useStyles(colors);
  const [textSearch, setTextSearch] = useState('');
  const { t } = useTranslation(RoutesTranslationKey.ortherRoute);
  const onSearch = (textsearch: string) => {
    if (textsearch !== '') {
      setTextSearch(textsearch);
      let tempData = data.filter(item => {
        return item.title.toLowerCase().indexOf(textsearch.toLowerCase()) > -1;
      });
      setData(tempData);
    }
    else {
      setData(dataDropdown);
    }
  }
  const clearSearch = () => {
    setTextSearch('');
    setData(dataDropdown);
  };

  return (
    <View style={{ flex: 1, paddingTop: 20, backgroundColor: colors.background }}>
      <ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 }}>
          <View style={[
            styles.groupInput,
            isFocus ?
              {
                borderWidth: 0.5,
                borderColor: colors.primary
              } : {
                borderWidth: 0.5,
                borderColor: colors.backgroundInputSearch
              }
          ]}>
            <FeatherIcon name="search" style={styles.colorMain} size={21} />
            <TextInput
              style={[styles.inputField]}
              placeholder={t(OtherTranslationKey.Search)}
              placeholderTextColor={colors.text} cursorColor={"#637899"}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => {
                setIsFocus(false);
              }}
              value={textSearch}
              onChangeText={textsearch => { onSearch(textsearch) }} />
            {
              textSearch.trim() !== '' && (
                <TouchableOpacity onPress={clearSearch}>
                  <Ionicons name="close" style={[styles.colorMain, { color: "#f89300" }]} size={26} />
                </TouchableOpacity>
              )
            }
          </View>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <FlatList
            data={data}
            extraData={data}
            renderItem={({ item, index }) => (
              <ItemDropdown title={item.title} description={item.description} key={index} />
            )} />
        </View>
      </ScrollView>
    </View>
  )
}

export default FAQ

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
  groupInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundInputSearch,
    borderRadius: 15,
    paddingHorizontal: 16,
  },
  colorMain: {
    color: colors.text,
  },
  inputField: {
    flexGrow: 1,
    height: "100%",
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginRight: 0,
    width: '70%'
  },
})
