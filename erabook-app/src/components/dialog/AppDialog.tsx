import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {AppThemeColors, useAppTheme} from '../../themes/theme.config';
import React from 'react';

export const AppDialog = () => {
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} color={colors.primary} />
    </View>
  );
};

const useStyle = (colors: AppThemeColors) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 9999,
      width: '100%',
      height: '100%',
      backgroundColor: colors.border,
      opacity: 0.5,
    },
  });
};
