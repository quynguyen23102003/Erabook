import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Popins } from 'components/popins'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppThemeColors, useAppTheme } from 'themes/theme.config'
import { useNavigation } from '@react-navigation/native'
import { RootStackProps } from 'navigator/types'
import { useTranslation } from 'react-i18next'
import { OtherTranslationKey, RoutesTranslationKey } from 'translations/constants'
import { AppHeader } from '@components/AppHeader'
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';

const HeaderNotification = () => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const navigation = useNavigation<RootStackProps>();
    const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
    return (
        <AppHeader
        icon
        LeftComponent={() => {
            return (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IconAntDesign size={24} name='arrowleft' style={styles.icon} />
                </TouchableOpacity>
            );
        }}
            title={translate(OtherTranslationKey.Notification)}
            RightComponent={() => {
                return (
                    <IconFeather size={24} name='settings' style={styles.icon} />
                );
            }}
        />
    )
}

export default HeaderNotification

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    text500: {
        color: colors.text,
        fontFamily: Popins[500],
        marginLeft: 12,
        fontSize: 18
    },
    icon: {
        color: colors.text
    }
})