import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import IconSearch from 'react-native-vector-icons/Feather';
import { Popins } from 'components/popins'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppThemeColors, useAppTheme } from 'themes/theme.config'
import { useNavigation } from '@react-navigation/native'
import { RootStackName, RootStackProps } from 'navigator/types'
import { useTranslation } from 'react-i18next'
import { OtherTranslationKey, RoutesTranslationKey } from 'translations/constants'
import { AppHeader } from '@components/AppHeader';
import Icon from 'react-native-vector-icons/Feather';

const GenreHeader: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<RootStackProps>();
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const onPressSearch = () => {
    navigation.navigate(RootStackName.SearchScreen);
}
  const renderRight = () => {
    return (
      <TouchableOpacity style={styles.center} onPress={onPressSearch}>
        <IconSearch name="search" style={styles.icon} size={24} />
      </TouchableOpacity>
    );
  }
  return (
    <AppHeader
      LeftComponent={()=>{
        return(
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" style={styles.icon} size={24} />
          </TouchableOpacity>
        )
      }}
      RightComponent={renderRight}
      title={translate(OtherTranslationKey.Explore)}
    />
  )
}

export default GenreHeader

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
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4
},
})
