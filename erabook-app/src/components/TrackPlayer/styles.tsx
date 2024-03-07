import { AppThemeColors } from "@themes/theme.config";
import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get('screen');
export const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        maxHeight: height * 0.7,
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    text: {
        color: colors.text,
        fontSize: 16,
    },
    title: {
        color: colors.text,
        fontSize: 18,
        fontWeight: "bold",
        paddingBottom: 12,
        paddingHorizontal: 16,
    }
})