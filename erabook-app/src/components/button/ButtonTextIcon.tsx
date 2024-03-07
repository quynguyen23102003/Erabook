import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Popins} from '../popins';

interface ButtonTextIconProps {
  label: string;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  labelStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
}

const ButtonTextIcon: React.FC<ButtonTextIconProps> = ({
  label,
  labelStyle,
  buttonStyle,
  onPress,
  disabled,
  iconLeft,
  iconRight,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, buttonStyle]}>
      {iconLeft}
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      {iconRight}
    </TouchableOpacity>
  );
};

export default ButtonTextIcon;

const styles = StyleSheet.create({
  container: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
  },
  label: {
    fontFamily: Popins['600'],
    fontSize: 16,
    color: 'black',
    marginTop: 4,
  },
});
