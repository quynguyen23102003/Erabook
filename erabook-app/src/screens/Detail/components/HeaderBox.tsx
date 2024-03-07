import { Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import React from "react";
import { useAppTheme } from "@themes/theme.config";
import { useStyles } from "@screens/Detail/DetailScreen";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  onPress?: () => void;
  title?: string;
}

export const HeaderBox = ({ title, onPress }: Props) => {
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={() =>
        onPress && onPress()
      }>
      <Text style={[styles.text700, { fontSize: 20 }]}>
        {title}
      </Text>
      <Icon name="arrow-right" style={{ color: colors.primary }} size={26} />
    </TouchableOpacity>
  );
};
