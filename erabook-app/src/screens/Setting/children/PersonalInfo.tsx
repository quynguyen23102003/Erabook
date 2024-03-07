import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HeaderInfor } from "../components/HeaderInfor";
import { useAppSelector } from "../../../redux/storeAndStorage/persist";
import HeaderComponents from "../components/HeaderComponents";
import { useTranslation } from "react-i18next";
import { AccountScreenTranslationKey, OtherTranslationKey, RoutesTranslationKey } from "@translations/constants";
import { AppThemeColors, useAppTheme } from "@themes/theme.config";
import { Popins } from "@components/popins";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";

const PersonalInfo: React.FC = () => {
  const user = useAppSelector(state => state.root.user.userInfo);
  const { t: translate1 } = useTranslation(RoutesTranslationKey.accountRoute);
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const date = moment(Number(user?.birthDate) * 1000).format("DD/MM/YYYY");

  return (
    <View style={styles.container}>
      <HeaderComponents title={translate1(AccountScreenTranslationKey.PersonalInfo)} />
      <ScrollView>
      <HeaderInfor link='' />
      <View style={{ marginHorizontal: 16, flex: 1, borderTopWidth: 1, borderTopColor: colors.backgroundCategory, marginVertical: 12, paddingVertical: 12 }}>
        <View style={styles.groupTxt}>
          <Text style={styles.text}>{translate(OtherTranslationKey.Fullname)}</Text>
            <Text style={styles.textContent}>{user?.fullName}</Text>
        </View>
        <View style={styles.groupTxt}>
          <Text style={styles.text}>{translate(OtherTranslationKey.Username)}</Text>
            <Text style={styles.textContent}>{user?.username}</Text>
        </View>
        <View style={styles.groupTxt}>
          <Text style={styles.text}>Email</Text>
            <Text style={styles.textContent}>{user?.emailAddress}</Text>
        </View>
        <View style={styles.groupTxt}>
          <Text style={styles.text}>{translate(OtherTranslationKey.PhoneNumber)}</Text>
            <Text style={styles.textContent}>{user?.phoneAddress}</Text>
        </View>
        <View style={styles.groupTxt}>
          <Text style={styles.text}>{translate(OtherTranslationKey.DateofBirth)}</Text>
            <Text style={styles.textContent}>{date}</Text>
        </View>
        <View style={styles.groupTxt}>
          <Text style={styles.text}>{translate(OtherTranslationKey.Country)}</Text>
            <Text style={styles.textContent}>{user?.country}</Text>
        </View>
        <View style={styles.groupTxt}>
          <Text style={styles.text}>{translate(OtherTranslationKey.Gender)}</Text>
            <Text style={styles.textContent}>{user?.gender}</Text>
        </View>
      </View>
      </ScrollView>
    </View>
  )
}

export default PersonalInfo

const useStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  text: {
    fontFamily: Popins[500],
    color: colors.text,
    fontSize: 14,
    lineHeight: 24,
    marginTop: 5,
  },
  textContent: {
    fontFamily: Popins[600],
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 5,
    paddingVertical: 10, 
  },
  groupTxt: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    marginBottom: 26
  },
})
