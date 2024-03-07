import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {TouchableOpacity, GestureResponderEvent} from 'react-native';
import {Popins} from '@components/popins';


export interface IContactus {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}

const ItemContactus: React.FC<IContactus> = ({...props}) => {
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.icon}>{props.icon}</View>
      <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default ItemContactus

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.backgroundCategory,
      padding: 16,
      flexDirection: 'row',
      marginBottom: 16,
      backgroundColor: colors.googleButton,
      elevation: 0.5,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins[600],
    },
    icon: {
      marginRight: 16,
    },
  });
