import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Button } from 'react-native'
import React, { useState } from 'react'
import { Popins } from '../../../components/popins';
import Icon from 'react-native-vector-icons/Feather'
import { SwitchNotification } from '../components/SwitchNotification';
import { RightNotification } from '../components/RightNotification';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { useTranslation } from 'react-i18next';
import { AccountScreenTranslationKey, OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';
import HeaderComponents from '../components/HeaderComponents';
import { useNavigation } from '@react-navigation/native';
import { RootStackName, RootStackProps } from '@navigator/types';
import { ButtonText } from '@components';

export const Security: React.FC = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
    const { t: translate1 } = useTranslation(RoutesTranslationKey.accountRoute);
    const navigation = useNavigation<RootStackProps>();

    return (
            <View style={[styles.container]}>
                <HeaderComponents title={translate1(AccountScreenTranslationKey.Security)}/>
                <View style={{paddingHorizontal: 16}}>
                <View style={{paddingTop: 30}}>
                    <SwitchNotification title={translate(OtherTranslationKey.Rememberme)}/>
                    <SwitchNotification title={translate(OtherTranslationKey.Biometric)}/>
                    <SwitchNotification title={translate(OtherTranslationKey.FaceID)}/>
                    <SwitchNotification title={translate(OtherTranslationKey.SMSAuthenticator)}/>
                    <SwitchNotification title={translate(OtherTranslationKey.GoogleAuthenticator)}/>
                    <RightNotification title={translate(OtherTranslationKey.DeviceManagement)} content=''/>
                </View>
                <ButtonText
                    containerStyle={{ backgroundColor: colors.secondary }}
                    onPress={() => navigation.navigate(RootStackName.ChangePassword)}
                    labelStyle={{ color: 'white' }}
                    label={translate(OtherTranslationKey.ChangePassword)}
                />
                </View>
            </View>
    )
}

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    btnChange: {
        paddingVertical: 13,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    txtChange: {
        fontFamily: Popins[600],
        color: colors.textSecondary,
        fontSize: 16,
    }
})