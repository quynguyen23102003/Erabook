import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {CheckBox} from '@rneui/base';
import {Popins} from '@components/popins';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LanguageKey, RoutesTranslationKey} from '@translations/constants';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface titleCheckBox {
  title: string;
  selected: boolean;
  onPress: () => void;
  initialChecked?: boolean;
}

const CheckBoxFilter: React.FC<titleCheckBox> = ({
  title, selected, onPress, initialChecked = false
}) => {
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const [selectedIndex, setSelectedIndex] = React.useState(initialChecked);
  const { t: translate } = useTranslation(RoutesTranslationKey.ortherRoute);
  const toggleCheckbox = () => setSelectedIndex(!selectedIndex);
  const handlePress = () => {
    setSelectedIndex(!selectedIndex);
    onPress(); 
  };
  return (
    <View style={styles.container}>
      <Pressable style={[styles.container, 
      {borderTopWidth: 0,
      paddingTop: 0,
      paddingBottom: 0}]}
      onPress={handlePress}
      >
      <CheckBox
        checked={selected}
        onPress={onPress}
        checkedIcon={
          <Ionicons name="radio-button-on" size={24} color={colors.primary} />
        }
        uncheckedIcon={
          <Ionicons name="radio-button-off" size={24} color={colors.primary} />
        }
        checkedColor={colors.primary}
        uncheckedColor={colors.primary}
        containerStyle={{
          marginRight: 0,
          padding: 0,
          backgroundColor: colors.backgroundInputSearch,
          marginLeft: 0
        }}
      />
      <Text style={styles.title}>{translate(title)}</Text>
      </Pressable>
    </View>
  );
};

export default CheckBoxFilter;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.googleButton,
      borderTopColor: colors.backgroundCategory,
      borderTopWidth: 2,
      paddingTop: 5,
      paddingBottom: 5
    },
    title: {
      fontFamily: Popins[500],
      fontSize: 16,
      color: colors.text,
      marginLeft: 16
    },
  });
