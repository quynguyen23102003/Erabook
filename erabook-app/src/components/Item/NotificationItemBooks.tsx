import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from '@rneui/themed/dist/Image'
import { Popins } from '../popins'
import { AppThemeColors, useAppTheme } from 'themes/theme.config'
import { TOptionsSetting } from '@screens/NotificationBooks/options'
import { useTranslation } from 'react-i18next'
import { RoutesTranslationKey } from '@translations/constants'
import { OtherTranslationKey } from '../../translations/constants';

interface itemNotifiProps {
    id: number,
    icon: React.ReactNode,
    title: string,
    date: string,
    time: string,
    description: string,
    isNew: boolean
}

interface SettingItemProps extends TOptionsSetting {
    activeOpacity?: number;
    iconColor: string;
    backgroundColor: string;
}

const NotifiItemBook: React.FC<SettingItemProps> = ({ iconColor, backgroundColor, ...props }) => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const { t } = useTranslation(RoutesTranslationKey.ortherRoute);
    return (
        <TouchableOpacity style={styles.container} key={props.id} activeOpacity={props.activeOpacity || 0.7}>
            <View style={styles.main}>
                <View style={styles.group_content}>
                    <View
                        style={[
                            styles.containerImage,
                            {
                                backgroundColor: backgroundColor
                            }
                        ]}>
                        <Image
                            style={[styles.icon, { tintColor: iconColor }]}
                            source={props.icon}
                        />
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.title}>{t(props.title)}</Text>
                        {/* <View style={styles.group_times}>
                            <Text style={styles.date}>{props.date}</Text>
                            <Text style={styles.doc}>|</Text>
                            <Text style={styles.time}>{props.time}</Text>
                        </View> */}
                    </View>
                </View>
                {props.isNew && <Text style={styles.new}>{t(OtherTranslationKey.New)}</Text>}
            </View>
            <Text style={styles.description}>{t(props.description)}</Text>
        </TouchableOpacity>
    )
}

export default NotifiItemBook
const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        width: '100%',
        marginBottom: 15
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    group_content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 60,
        height: 60,
    },
    content: {
        flexDirection: 'column',
    },
    title: {
        fontFamily: Popins[600],
        color: colors.text,
        fontSize: 16
    },
    group_times: {
        flexDirection: 'row'
    },
    date: {
        fontFamily: Popins[400],
        marginRight: 5,
        fontSize: 14,
        color: colors.textDescription
    },
    doc: {
        fontFamily: Popins[400],
        fontSize: 14,
        color: colors.textDescription
    },
    time: {
        fontFamily: Popins[400],
        marginStart: 5,
        fontSize: 14,
        color: colors.textDescription
    },
    new: {
        flex: 0,
        padding: 5,
        backgroundColor: '#f99300',
        height: 30,
        borderRadius: 10,
        color: 'white',
        width: 55,
        textAlign: 'center',
        fontFamily: Popins[600],
        fontSize: 14
    },
    description: {
        fontFamily: Popins[400],
        fontSize: 14,
        color: colors.textDescription
    },
    containerImage: {
        borderRadius: 10000,
        width: 53,
        height: 53,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    icon: {
        width: 32, 
        height: 32
    }
})