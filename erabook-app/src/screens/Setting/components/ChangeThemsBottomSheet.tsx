import CustomBottomSheet from "../../../components/bottomsheet";
import { StyleSheet, View } from "react-native";
import { AppThemeColors, useAppTheme } from "../../../themes/theme.config";
import { useAppDispatch, useAppSelector } from "../../../redux/storeAndStorage/persist";
import { bottomSheet, BottomSheetName } from "../../../redux/slice/bottomsheet.slice";
import React, { useCallback, useMemo } from "react";
import { Popins } from "../../../components/popins";
import { ChangeThemeOptions } from "./options";
import { RatioBottom } from "../../../components/button/RatioBottom";
import { changeThemeColor, ThemeKey } from "../../../redux/slice/setting.slice";
import { useTranslation } from "react-i18next";
import { RoutesTranslationKey } from "../../../translations/constants";

export const ChangeThemesBottomSheet = () => {
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const {t:translate} = useTranslation(RoutesTranslationKey.accountRoute);
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => state.root.bottomSheet.ChangeThemeBottomSheet);
  const currentTheme = useAppSelector(state => state.root.setting.themeColor);
  const data = useMemo(() => {
    return ChangeThemeOptions.map(item => {
      if (item.id === currentTheme) {
        return {
          ...item,
          checked: true
        };
      } else {
        return {
          ...item,
          checked: false
        };
      }
    });
  }, [currentTheme]);

  const closeBottomSheet = useCallback(() => {
    dispatch(bottomSheet(
      {
        name: BottomSheetName.ChangeTheme,
        status: false
      }
    ));
  }, []);

  const handlePress = useCallback((id: ThemeKey) => {
    closeBottomSheet();
    dispatch(changeThemeColor(id));
  }, []);

  console.log("render");

  return (
    <CustomBottomSheet
      indicator
      backDropOpacity={0.8}
      enablePanDownToClose
      visible={status}
      onClose={closeBottomSheet}>
      <View style={{paddingBottom:10}}>
        {
          data.map((item, index) => {
            return (
              <RatioBottom
                key={index}
                id={item.id}
                title={translate(item.title)}
                active={item.checked}
                onPress={() => {
                  handlePress(item.id);
                }} />
            );
          })
        }
      </View>
    </CustomBottomSheet>
  );
};

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {},
  subtitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: Popins["400"]
  }
});
