// SwitchNotification.tsx
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Switch } from 'react-native-switch';
import { Popins } from '../../../components/popins';
import { AppThemeColors, useAppTheme } from '@themes/theme.config';

interface Props {
  title?: string;
  isEnabled?: boolean;
  onValueChange?: (isEnabled: boolean) => void;
}

export const SwitchNotification: React.FC<Props> = ({ title, isEnabled, onValueChange }) => {
  const { colors } = useAppTheme();
  const styles = useStyles(colors);

  const handleSwitchChange = (val: boolean) => {
    if (onValueChange) {
      onValueChange(val);
    }
  };

  useEffect(() => {
    console.log('Switch state changed:', isEnabled);
  }, [isEnabled]);

  return (
    <View style={styles.groupNotification}>
      <Text style={styles.txtTitle}>{title}</Text>
      <View>
        <Switch
          value={isEnabled}
          onValueChange={handleSwitchChange}
          disabled={false}
          circleSize={19}
          barHeight={19}
          circleBorderWidth={2}
          circleInActiveColor={'#ffffff'}
          circleBorderInactiveColor={colors.backgroundSwitch}
          backgroundInactive={colors.backgroundSwitch}
          circleActiveColor={'#ffffff'}
          circleBorderActiveColor={'#F89300'}
          backgroundActive={'#F89300'}
          changeValueImmediately={true}
          innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }}
          outerCircleStyle={{}}
          renderActiveText={false}
          renderInActiveText={false}
          switchLeftPx={2}
          switchRightPx={2}
          switchWidthMultiplier={2}
          switchBorderRadius={30}
        />
      </View>
    </View>
  );
};

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    groupNotification: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 25,
    },
    txtTitle: {
      fontFamily: Popins[500],
      color: colors.text,
      fontSize: 16,
    },
  });
