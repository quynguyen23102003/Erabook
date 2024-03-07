import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { AppThemeColors, useAppTheme } from "../../themes/theme.config";
import { Popins } from "../popins";
import { useTranslation } from "react-i18next";
import { RoutesTranslationKey } from "../../translations/constants";

interface RatioBottomProps {
  id?: string;
  title: string;
  onPress?: () => void;
  active: boolean;
}

export const RatioBottom: React.FC<RatioBottomProps> = ({ id, active, onPress, title }) => {
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress();
      }}
      style={styles.container}>
      <View style={{}}>
        <Text style={styles.subtitle}>{title}</Text>
      </View>
      <RadioButton
        value={id || title}
        uncheckedColor={colors.primary}
        status={active ? "checked" : "unchecked"}
      />
    </TouchableOpacity>
  );
};

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      paddingHorizontal: 16
    },
    subtitle: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins["400"]
    }
  })
;
