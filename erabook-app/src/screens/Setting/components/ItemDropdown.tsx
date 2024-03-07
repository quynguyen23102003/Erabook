import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import Octicons from 'react-native-vector-icons/Octicons';
import { Popins } from '@components/popins';
import { OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';
import { useTranslation } from 'react-i18next';

export interface IDropdown {
    title : OtherTranslationKey,
    description : string
}

const ItemDropdown: React.FC<IDropdown> = ({title, description}) => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const [isClicked, setIsClicked] = useState(false);
    const {t} = useTranslation(RoutesTranslationKey.ortherRoute);
    return (
        <Pressable style={styles.container} onPress={() => { setIsClicked(!isClicked) }}>
            <View style={styles.groupDropdown}>
                <Text style={styles.title}>{t(title)}</Text>
                {
                    isClicked ? (
                        <Octicons name='triangle-up' size={24} color={colors.primary} />
                    ) : (
                        <Octicons name='triangle-down' size={24} color={colors.primary} />
                    )
                }
            </View>
            {isClicked ? (
                <Text style={styles.description}>{t(description)}</Text>
            ) : null}
        </Pressable>
    )
}

export default ItemDropdown

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 10,
        borderColor: colors.backgroundCategory,
        backgroundColor: colors.googleButton,
        elevation: 0.5,
        marginBottom: 16
    },
    groupDropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontFamily: Popins[600],
        fontSize: 16,
        color: colors.text
    },
    description: {
        fontFamily: Popins[500],
        fontSize: 14,
        color: colors.textDescription,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1.5,
        borderTopColor: colors.backgroundCategory,
    }
})