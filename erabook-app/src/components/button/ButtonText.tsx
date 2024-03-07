import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  Animated,
} from 'react-native';
import React from 'react';
import {Popins} from '../popins';
import {useAppTheme} from '@themes/theme.config';

interface ButtonTextProps {
  label: string;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>; // style bên trong button: margin, padding, backgroundColor, justifyContent, alignItems
  style?: StyleProp<ViewStyle>; // style vỏ bọc button: style về kích thước, position, flex
  activeOpacity?: number;
}

const ButtonText: React.FC<ButtonTextProps> = ({
  label,
  labelStyle,
  containerStyle,
  onPress,
  disabled,
  style,
}) => {
  const {colors} = useAppTheme();
  const animatedButtonScale = new Animated.Value(1);
  const onPressIn = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animatedScaleStyle = {
    transform: [{scale: animatedButtonScale}],
  };

  return (
    <Pressable
      style={[style]}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}>
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          disabled && {backgroundColor: colors.backgroundInputSearch},
          animatedScaleStyle,
        ]}>
        <Text
          style={[styles.label, labelStyle, disabled && {color: colors.gray}]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default ButtonText;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
  },
  label: {
    fontFamily: Popins['600'],
    fontSize: 16,
    color: 'black',
    marginTop: 4,
  },
});
