import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { TOptionsSetting } from "./options";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/AntDesign";
import { RoutesTranslationKey } from "@translations/constants";
import { AppThemeColors, useAppTheme } from "@themes/theme.config";
import { Popins } from "@components/popins";

interface SettingItemProps extends TOptionsSetting {
  activeOpacity?: number;
  actionVisible?: boolean;
  actionComponent?: React.ReactNode;
  iconColor?: string;
  backgroundColor?: string;
}

const SettingItem: React.FC<SettingItemProps> = (
  {
    onPress,
    actionComponent,
    actionVisible = true,
    iconColor,
    backgroundColor,
    ...props
  }
) => {
  const { colors } = useAppTheme();
  const styles = useStyle(colors);
  const { t } = useTranslation(RoutesTranslationKey.accountRoute);
  console.log(actionComponent ? "true" : "false");

  return (
    <TouchableOpacity
      activeOpacity={props.activeOpacity || 0.7}
      onPress={() => onPress && onPress()}
      style={styles.line}>
      <View style={styles.line_left}>
        <View
          style={[
            styles.containerImage,
            {
              backgroundColor: backgroundColor
            }
          ]}>
          <Image
            style={[styles.image, { tintColor: iconColor }]}
            source={props.icon}
          />
        </View>
        <View>
          <Text style={styles.big_text}>
            {t(props.title)}
          </Text>
        </View>
      </View>
      {
        actionComponent ?
          actionComponent : (
            actionVisible && (
              <Icon name="right" size={16} color={colors.text} />
            )
          )
      }
    </TouchableOpacity>
  );
};

export const SettingItemMeno = React.memo(SettingItem);
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
      alignItems: "center",
      gap: 12
    },
    icon: {
      width: 48,
      height: 48
    },
    big_text: {
      fontFamily: Popins["600"],
      color: colors.text,
      marginVertical: 4,
      fontSize: 16
    },
    small_text: {
      fontFamily: Popins["400"],
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
    }
  });
