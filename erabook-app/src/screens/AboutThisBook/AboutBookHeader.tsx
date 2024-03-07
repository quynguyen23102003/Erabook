import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { useNavigation } from '@react-navigation/native';
import { RootStackProps } from '@navigator/types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/AntDesign";
import { Popins } from '@components/popins';
import { useTranslation } from 'react-i18next';
import { OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';

const AboutBookHeader: React.FC = () => {
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<RootStackProps>();
    const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
    return (
        <View style={[styles.center, {paddingTop: insets.top + 8 }]}>
            <TouchableOpacity style={{ marginEnd: 12 }} onPress={() => navigation.goBack()}>
                <Icon name="arrowleft" size={24} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.text500}>{translate(OtherTranslationKey.About)}</Text>
        </View>
    )
}

export default AboutBookHeader

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    center: {
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: colors.background
    },
    text500: {
        color: colors.text,
        fontFamily: Popins[500],
        top: 2,
        fontSize: 20
    },
    icon: {
        color: colors.text
    }
})