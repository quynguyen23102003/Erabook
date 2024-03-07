import { StyleSheet, Text, View, Linking } from 'react-native';
import React from 'react';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import ItemContactus, { IContactus } from '../components/ItemContactus';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { RootStackName, RootStackProps } from '@navigator/types';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Contactus: React.FC = () => {
  const { colors } = useAppTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<RootStackProps>();

  const DataContactus: IContactus[] = [
    {
      icon: (
        <MaterialCommunityIcons
          name="headset"
          size={24}
          color={colors.primary}
        />
      ),
      title: 'Customer Service',

      onPress: () => {
        console.log('Onpress ContactForm');
        navigation.navigate(RootStackName.ContactForm);
      },
    },
    {
      icon: <FontAwesome name="whatsapp" size={24} color={colors.primary} />,
      title: 'WhatsApp',
      onPress: () => {
        console.log('Onpress WhatApp');
        navigation.navigate(RootStackName.WhatApps);
      },
    },
    {
      icon: (
        <MaterialCommunityIcons name="web" size={24} color={colors.primary} />
      ),
      title: 'Website',
      onPress: () => {
        Linking.openURL('http://tuthithutrang.byethost33.com');
      },
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="facebook"
          size={24}
          color={colors.primary}
        />
      ),
      title: 'Facebook',
      onPress: () => {
        Linking.openURL('https://www.facebook.com/groups/264680289623287/');
      },
    },
    {
      icon: <FontAwesome name="twitter" size={24} color={colors.primary} />,
      title: 'Twitter',
      onPress: () => {
        Linking.openURL('https://twitter.com/home');
      },
    },
    {
      icon: (
        <Entypo name="instagram-with-circle" size={24} color={colors.primary} />
      ),
      title: 'Instagram',
      onPress: () => {
        Linking.openURL('https://www.instagram.com/');
      },
    },
    {
      icon: <FontAwesome name="gamepad" size={24} color={colors.primary} />, // Replace with game-related icon
      title: 'Game Center', // Update the title accordingly
      onPress: () => {
        console.log('Onpress Game Center');
        Linking.openURL('http://thutrang2003.byethost33.com');
      },
    },
  ];

  return (
    <View style={{ flex: 1, paddingTop: 20, backgroundColor: colors.background }}>
      {
        DataContactus.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress}>
            <ItemContactus icon={item.icon} title={item.title} />
          </TouchableOpacity>
        ))
      }
    </View>
  );
};

export default Contactus;

const useStyles = (colors: AppThemeColors) => StyleSheet.create({});
