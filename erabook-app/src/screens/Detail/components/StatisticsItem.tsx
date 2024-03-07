import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppThemeColors, useAppTheme} from '@themes/theme.config';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {faStarHalfStroke} from '@fortawesome/free-regular-svg-icons';

interface Props {
  icon?: boolean;
  iconName?: IconDefinition;
  IconComponent?: () => React.ReactNode | React.JSX.Element;
  title?: string | number;
  subtitle?: string;
}

export const StatisticsItem = ({
  title = '',
  IconComponent,
  iconName,
  subtitle = '',
  icon = false,
}: Props) => {
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  // const {t: translate} = useTranslation(RoutesTranslationKey.ortherRoute);
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={[styles.text]}>{title?.toString().substring(0, 3)}</Text>
        {icon ? (
          <FontAwesomeIcon
            size={16}
            color={colors.gray}
            icon={iconName || faStarHalfStroke}
          />
        ) : IconComponent ? (
          IconComponent()
        ) : (
          <></>
        )}
      </View>
      <Text style={styles.subText}>{subtitle}</Text>
    </View>
  );
};

const useStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    box: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    },
    text: {
      color: colors.text,
      fontSize: 16,
    },
    subText: {
      color: colors.textDescription,
      fontSize: 14,
    },
  });
