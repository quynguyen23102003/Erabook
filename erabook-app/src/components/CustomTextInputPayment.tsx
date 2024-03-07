import React from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {Popins} from './popins';
import {AppThemeColors, useAppTheme} from '../themes/theme.config';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
}
export const CustomTextInputPayment: React.FC<CustomTextInputProps> = ({
  label,
  wrapperStyle,
  ...textInputProps
}) => {
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  return (
    <View style={wrapperStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput {...textInputProps} />
    </View>
  );
};

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    label: {
      color: colors.text,
      fontSize: 16,
      fontFamily: Popins['600'],
    },
  });
