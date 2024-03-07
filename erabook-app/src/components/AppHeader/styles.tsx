import { StyleSheet } from "react-native";
import { AppThemeColors } from "@themes/theme.config";

export const useStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 16,
    textAlignVertical: "center"
  }
});
