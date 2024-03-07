import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {useAppTheme} from '@themes/theme.config';
import {useStyles} from '@components/AppHeader/styles';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBook} from '@fortawesome/free-solid-svg-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconDefinition} from '@fortawesome/free-regular-svg-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface IAppHeaderProps {
  title?: string;
  icon?: boolean;
  iconFontAweSome?: IconDefinition;
  iconSize?: number;
  onIconPress?: () => void;
  iconActive?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  LeftComponent?: () => React.ReactNode | JSX.Element;
  LeftComponentStyle?: StyleProp<ViewStyle>;
  RightComponent?: () => React.ReactNode | JSX.Element;
  RightComponentStyle?: StyleProp<ViewStyle>;
  line?: boolean;
  lineStyle?: StyleProp<ViewStyle>;
  disablePaddingTop?: boolean;
}

export const AppHeader: React.FC<IAppHeaderProps> = ({
  title,
  icon = true,
  style,
  titleStyle,
  titleContainerStyle,
  iconFontAweSome,
  iconSize,
  RightComponentStyle,
  RightComponent,
  onIconPress,
  iconActive = false,
  line = false,
  lineStyle,
  disablePaddingTop = false,
  LeftComponentStyle,
  LeftComponent,
}) => {
  const {colors} = useAppTheme();
  const styles = useStyles(colors);
  const {top} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        !disablePaddingTop
          ? {
              paddingTop: top,
              height: 54 + top,
            }
          : {
              height: 54,
            },
        style,
        line && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        lineStyle,
      ]}>
      {icon ? (
        LeftComponent ? (
          LeftComponent()
        ) : (
          <TouchableOpacity
            onPress={() => onIconPress && onIconPress()}
            activeOpacity={iconActive ? 0.6 : 1}>
            <FontAwesomeIcon
              icon={iconFontAweSome || faBook}
              size={iconSize || 20}
              color={colors.primary}
            />
          </TouchableOpacity>
        )
      ) : (
        <></>
      )}
      {title && (
        <View style={[styles.titleContainer, titleContainerStyle]}>
          <Text numberOfLines={1} style={[styles.title, titleStyle]}>
            {title}
          </Text>
        </View>
      )}
      {
        <View style={[RightComponentStyle]}>
          {RightComponent && RightComponent()}
        </View>
      }
    </View>
  );
};
