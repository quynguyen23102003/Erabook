import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/AntDesign'
import { Popins } from '../../../components/popins'
import { AppThemeColors, useAppTheme } from '@themes/theme.config'
import { useTranslation } from 'react-i18next'
import { RoutesTranslationKey } from '@translations/constants'

interface Props {
    title: string,
    content: string
}

export const RightNotification: React.FC<Props> = ({ title, content }) => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
    return (
        <View>
            <TouchableOpacity style={[styles.container]}>
                <Text style={[styles.txtTitle]}>{title}</Text>
                <View style={[styles.right]}>
                    <Text style={styles.txtContent}>{content}</Text>
                    <Icon size={16} name='right' color={colors.text} />
                </View>
            </TouchableOpacity>
        </View>
    )
}


const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 25
    },
    txtTitle: {
        fontFamily: Popins[500],
        color: colors.text,
        fontSize: 16,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtContent: {
        fontFamily: Popins[600],
        color: colors.text,
        fontSize: 14,
        paddingRight: 15,
        paddingTop: 3
    }
})