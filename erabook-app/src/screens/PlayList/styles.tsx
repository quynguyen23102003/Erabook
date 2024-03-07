import { AppThemeColors } from "@themes/theme.config";
import { StyleSheet } from "react-native";


export const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background + "100",
    },
    text: {
        color: colors.text,
        fontSize: 16,
    },
    header: {
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text,
    },
    content: {
        paddingVertical: 20
    },
    thumbnail: {
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.text,
    },
    control: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    play: {
        width: 64,
        height: 64,
        borderRadius: 123,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomSheet: {
    },
    item: {
        marginVertical: 12,
        gap: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        height: 1.2,
        width: '100%',
        backgroundColor: colors.border
    }
})