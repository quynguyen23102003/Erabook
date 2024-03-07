import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {CheckBox} from '@rneui/base';
import {Popins} from '@components/popins';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LanguageKey} from '@translations/constants';
import {titleLanguage} from '../children/LanguageSetting';

export interface CheckBoxLanguageProps {
  item: titleLanguage;
  selectedKeyCode: LanguageKey;
}

const CheckBoxLanguage: React.FC<CheckBoxLanguageProps> = ({
  item,
  selectedKeyCode,
}) => {
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  // const [selectedIndex, setSelectedIndex] = React.useState(false);
  // const toggleCheckbox = () => setSelectedIndex(!selectedIndex);
  return (
    <View style={styles.continer}>
      <Text style={styles.title}>{item.title}</Text>
      <CheckBox
        checked={item.keyCode === selectedKeyCode}
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
          backgroundColor: colors.background,
        }}
      />
    </View>
  );
};

export default CheckBoxLanguage;

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    continer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontFamily: Popins[500],
      fontSize: 16,
      color: colors.text,
    },
  });
