import { Image, StyleSheet, Text, View } from "react-native";
import { AccountScreenTranslationKey, RoutesTranslationKey } from "../../../translations/constants";
import React from "react";
import { AppThemeColors, useAppTheme } from "../../../themes/theme.config";
import { Popins } from "../../../components/popins";
import { useTranslation } from "react-i18next";

export const Header: React.FC = () => {

  const { colors } = useAppTheme();
  const styles = useStyle(colors);
  const { t } = useTranslation(RoutesTranslationKey.accountRoute);

  return (
    <View style={[styles.line, { paddingVertical: 0, marginBottom: 10 }]}>
      <View style={styles.line_left}>
        <Image
          style={[styles.image, { marginRight: 10, width: 32, height: 32 }]}
          source={require("../../../assets/icon/main/main-icon.png")}
        />
        <Text style={styles.big_text}>
          {t(AccountScreenTranslationKey.Account)}
        </Text>
      </View>
    </View>
  );
};

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      paddingHorizontal: 16
    },
    section: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1
    },
    line: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8
    },
    line_left: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    icon: {
      width: 48,
      height: 48
    },
    big_text: {
      fontFamily: Popins["600"],
      // fontStyle: '',
      // fontWeight: '700',
      color: colors.text,
      marginVertical: 5,
      fontSize: 24
    },
    small_text: {
      fontFamily: Popins["400"],
      // fontStyle: 'normal',
      // fontWeight: '400',
      fontSize: 14,
      color: colors.text,
      marginVertical: 5
    },
    image: {
      width: 24,
      height: 24,
      borderRadius: 31,
      overflow: "hidden"
    },
    containerImage: {
      borderRadius: 10000,
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20
    }
  });
