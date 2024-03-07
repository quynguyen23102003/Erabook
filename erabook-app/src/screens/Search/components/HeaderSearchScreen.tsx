import { StyleSheet, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { RootStackName, RootStackProps } from "navigator/types";
import { AppThemeColors, useAppTheme } from "themes/theme.config";
import { TouchableOpacity } from "react-native-gesture-handler";
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { useTranslation } from "react-i18next";
import { OtherTranslationKey, RoutesTranslationKey } from "@translations/constants";
import { clearAllFilterData } from "@screens/Filter/FilterScreen";

export interface HeaderSearchScreenProps {
  onSearchTextChange: (textSearch: string) => void;
}

const HeaderSearchScreen: React.FC<HeaderSearchScreenProps> = ({ onSearchTextChange }) => {
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const [textSearch, setTextSearch] = useState('');
  const navigation = useNavigation<RootStackProps>();
  const [isFocus, setIsFocus] = useState(false);
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const throttle = (func: (...args: any[]) => any, delay: number) => {
    let lastExecTime = 1;

    return (...args: any[]) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        lastExecTime = currentTime;
        func(...args);
      }
    };
  };
  const handleTextChange = throttle((text: string) => {
    setTextSearch(text);
    onSearchTextChange(text);
  }, 1000);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity onPress={()=> {
        clearAllFilterData();
        navigation.goBack();
      }}>
        <IconAntDesign size={24} name='arrowleft' color={colors.text} />
      </TouchableOpacity>
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
      <Icon name="search" style={styles.colorMain} size={21} />
      <TextInput
        style={[styles.inputField]}
        placeholder={translate(OtherTranslationKey.Search)}
        placeholderTextColor={colors.text} cursorColor={"#637899"}
        value={textSearch}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          setIsFocus(false);
        }}
        onChangeText={handleTextChange} />
        <TouchableOpacity onPress={() => navigation.navigate(RootStackName.FilterScreen)}> 
        <MaterialCommunityIcons name="tune-variant" style={[styles.colorMain, { color: "#f89300" }]} size={26} />
        </TouchableOpacity>
    </View>
    </View>
  )
}
export default HeaderSearchScreen;
const useStyles = (colors: AppThemeColors) => StyleSheet.create({
  groupInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundInputSearch,
    borderRadius: 15,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 10
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
