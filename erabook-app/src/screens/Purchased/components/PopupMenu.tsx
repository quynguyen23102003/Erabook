import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Popins} from '../../../components/popins';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppThemeColors, useAppTheme} from 'themes/theme.config';
import {Divider} from 'react-native-paper';

export interface OptionItem {
  icon: string;
  label: string;
}

interface PopupMenuProp {
  data: {
    icon: string;
    label: string;
  }[];
  setOptionSelected: React.Dispatch<
    React.SetStateAction<OptionItem | undefined>
  >;
}

const PopupMenu: React.FC<PopupMenuProp> = ({data, setOptionSelected}) => {
  const {colors} = useAppTheme();
  const styles = useStyle(colors);
  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
        }}>
        <MaterialCommunityIcons
          name="dots-vertical"
          color={colors.text}
          size={24}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            width: 'auto',
            marginTop: 30,
            borderRadius: 16,
            elevation: 2,
            backgroundColor: colors.background,
          },
        }}>
        {data.map((item, index) => (
          <MenuOption key={item.label} onSelect={() => setOptionSelected(item)}>
            <View style={styles.optionWrapper}>
              <Ionicons name={item.icon} size={24} color={colors.text} />
              <Text style={{color: colors.text, fontFamily: Popins['500']}}>
                {item.label}
              </Text>
            </View>
            {index !== data.length - 1 && (
              <Divider style={{backgroundColor: colors.border}} />
            )}
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

// const Divider = () => <View style={styles.divider} />;
export default PopupMenu;

const useStyle = (colors: AppThemeColors) =>
  StyleSheet.create({
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.background,
      marginHorizontal: 10,
    },

    optionWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      margin: 10,
    },
  });
