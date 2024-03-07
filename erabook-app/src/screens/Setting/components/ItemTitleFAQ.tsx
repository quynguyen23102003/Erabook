import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Popins } from '@components/popins';
import { OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';
import { useTranslation } from 'react-i18next';

export interface TitleList {
    title: OtherTranslationKey
  }

const ItemTitleFAQ: React.FC<TitleList> = ({title}) => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const [isCheck, setIsCheck] = useState(true);
    const {t} = useTranslation(RoutesTranslationKey.ortherRoute);
    return (
        <TouchableOpacity style={[styles.btn, isCheck ? {} : { backgroundColor: colors.primary }]} onPress={() => { setIsCheck(!isCheck) }}>
            <Text style={[styles.textBtn, isCheck ? {} : {color: '#ffffff'}]}>{t(title)}</Text>
        </TouchableOpacity>
    )
}

export default ItemTitleFAQ

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    btn: {
        paddingVertical: 5,
        paddingHorizontal: 16,
        backgroundColor: colors.background,
        marginRight: 16,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.primary
      },
      textBtn: {
        fontSize: 16,
        fontFamily: Popins[500],
        color: colors.primary
      }
})