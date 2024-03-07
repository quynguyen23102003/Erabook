import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { AccountScreenTranslationKey, OtherTranslationKey, RoutesTranslationKey } from '@translations/constants';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import HeaderComponents from '../components/HeaderComponents';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Popins } from '@components/popins';
import FAQ from './FAQ';
import Contactus from './Contactus';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Tab {
  titleTab: OtherTranslationKey
}

const listTab: Tab[] = [
  {
    titleTab: OtherTranslationKey.FAQ
  },
  {
    titleTab: OtherTranslationKey.Contactus
  }
]

const Tab = createMaterialTopTabNavigator();

const HelpCenter: React.FC = () => {
  const { t: translate1 } = useTranslation(RoutesTranslationKey.accountRoute);
  const { t } = useTranslation(RoutesTranslationKey.ortherRoute);
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const [titleTab, setTitleTab] = useState('FAQ');
  const setTitleTabFilter = (titleTab: string) => {
    setTitleTab(titleTab)
  }
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderComponents title={translate1(AccountScreenTranslationKey.HelpCenter)} />
      {/* <View style={styles.listTab}>
        {
          listTab.map((item, index)=> (
            <TouchableOpacity style={[styles.btnTab, titleTab === item.titleTab && styles.btnTabActive]} key={index}
            onPress={() => setTitleTabFilter(item.titleTab)}
            >
              <Text style={[styles.textTab, titleTab === item.titleTab && styles.textTabActive]}>{t(item.titleTab)}</Text>
            </TouchableOpacity>
          ))
        }
      </View>
      {titleTab === 'FAQ' ? (
        <ScrollView>
          <FAQ/>
        </ScrollView>
      ) : (
        <View style={{paddingHorizontal: 16}}>
          <Contactus/>
        </View>
      )} */}
      <Tab.Navigator
        screenOptions={{
          tabBarLabel({ children, color, focused }) {
            return (
              <View style={{ height: 50, justifyContent: 'center' }}>
                <Text style={focused ? styles.textTabActive : styles.textTab}>{children}</Text>
              </View>
            )
          },
          tabBarAndroidRipple: {
            color: colors.background
          },
          tabBarIndicatorStyle: { backgroundColor: colors.primary }
        }}
      >
        <Tab.Screen name='FAQ' component={FAQ} />
        <Tab.Screen name='Contactus' component={Contactus} />
      </Tab.Navigator>
    </View>
  )
}

export default HelpCenter

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  listTab: {
    backgroundColor: colors.background,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnTab: {
    width: Dimensions.get('screen').width / 2.2,
    borderBottomWidth: 2,
    borderBottomColor: colors.backgroundCategory,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnTabActive: {
    borderBottomColor: colors.primary
  },
  textTab: {
    fontSize: 16,
    fontFamily: Popins[600],
    color: colors.textTab
  },
  textTabActive: {
    fontSize: 16,
    fontFamily: Popins[600],
    color: colors.text
  },
})
