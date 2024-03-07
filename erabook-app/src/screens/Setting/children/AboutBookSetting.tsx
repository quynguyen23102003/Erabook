import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Popins } from '../../../components/popins'
import Icon from 'react-native-vector-icons/AntDesign'
import { AppThemeColors, useAppTheme } from '@themes/theme.config'
import { useTranslation } from 'react-i18next'
import { AccountScreenTranslationKey, OtherTranslationKey, RoutesTranslationKey } from '@translations/constants'
import HeaderComponents from '../components/HeaderComponents'
import { RightNotification } from '../components/RightNotification'

const AboutBookSetting: React.FC = () => {
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const { t: translate1 } = useTranslation(RoutesTranslationKey.accountRoute);
  return (
      <View style={[styles.container]}>
        <HeaderComponents title={translate1(AccountScreenTranslationKey.AboutErabook)}/>
        <View style={{paddingHorizontal: 16}}>
        <View style={[{ alignItems: 'center', marginVertical: 12, marginTop: 32, borderBottomWidth: 0.5, borderBottomColor: colors.backgroundCategory, paddingBottom: 12}]}>
          <Image style={{ width: 82, height: 82 }} source={require('../../../assets/icon/main/main-icon.png')} />
          <Text style={[styles.text700, { fontSize: 16, marginTop: 12 }]}>Erabook v7.5.4</Text>
        </View>
        <View style={[{ marginTop: 12 }]}>
        <RightNotification title={translate(OtherTranslationKey.JobVacancy)} content='' />
        <RightNotification title={translate(OtherTranslationKey.Fees)} content='' />
        <RightNotification title={translate(OtherTranslationKey.Developer)} content='' />
        <RightNotification title={translate(OtherTranslationKey.Partner)} content='' />
        <RightNotification title={translate(OtherTranslationKey.Accessibility)} content='' />
        <RightNotification title={translate(OtherTranslationKey.Feedback)} content='' />
        <RightNotification title={translate(OtherTranslationKey.Rateus)} content='' />
        <RightNotification title={translate(OtherTranslationKey.VisitOurWebsite)} content='' />
        <RightNotification title={translate(OtherTranslationKey.FollowusonSocialMedia)} content='' />
        </View>
        </View>
      </View>
  )
}

export default AboutBookSetting


const useStyles = (colors: AppThemeColors) => StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  text700: {
    color: colors.text,
    fontFamily: Popins[700],
    top: 2.1,
  },
})
