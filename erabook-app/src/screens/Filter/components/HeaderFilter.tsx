import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { useTranslation } from 'react-i18next';
import { OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';
import { useNavigation } from '@react-navigation/native';
import { RootStackProps } from '@navigator/types';
import { AppHeader } from '@components/AppHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HeaderFilter: React.FC = () => {
    const { colors } = useAppTheme();
    const styles = useStyle(colors);
    const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
    const navigation = useNavigation<RootStackProps>();

    return (
        <View>
            <AppHeader
                LeftComponent={() => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='close' size={20} color={colors.text} />
                    </TouchableOpacity>
                )}
                title={translate(OtherTranslationKey.Filter)}
            />
        </View>
    )
}

export default HeaderFilter

const useStyle = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    }
})