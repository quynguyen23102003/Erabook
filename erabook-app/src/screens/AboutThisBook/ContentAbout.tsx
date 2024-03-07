import { StyleSheet, Text } from "react-native";
import React from "react";
import { AppThemeColors, useAppTheme } from "@themes/theme.config";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackName, RootStackParamList } from "@navigator/types";
import { Popins } from "@components/popins";

const ContentAbout: React.FC = () => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    type HomeProps = RouteProp<RootStackParamList, RootStackName.AboutEbookScreen>;
    const route = useRoute<HomeProps>();
    console.log("route ==> ", route.params);
    return (
        <Text style={styles.text400}>
            {route.params.description}
        </Text>
    )
}

export default ContentAbout

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    text400: {
        color: colors.textDescription,
        fontFamily: Popins[400],
        top: 1.8,
        fontSize: 14,
    },
})
