import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { RoutesTranslationKey } from "../translations/constants";
import { AppThemeColors, useAppTheme } from "../themes/theme.config";
import {
  AccountLineIconMemo,
  AccountSolidIconMemo,
  CartLineIconMemo,
  CartSolidIconMemo,
  HomeLineIconMemo,
  HomeSolidIconMemo,
  SearchLineIconMemo,
  SearchSolidIconMemo,
  WishListLineIconMemo,
  WishListSolidIconMemo
} from "../assets/svg-icon/rippleIcon";

const TabBottomBarCustom = ({ state, descriptors, navigation }: any) => {
  const { t: translate } = useTranslation(RoutesTranslationKey.bottomTabsRoute);
  const { colors } = useAppTheme();
  const styles = useStyle(colors);
  return (
    <View style={{ flexDirection: "row", backgroundColor: colors.white }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const [isFocused, setFocus] = React.useState(false);
        // = state.index === index;
        React.useEffect(() => {
          if (state.index == index) {
            setFocus(true);
          } else {
            setFocus(false);
          }
        })

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const widthAnimated = useSharedValue({ flex: 0 });
        //get layout
        const onLayout = (event: any) => {
          var { width, height } = event.nativeEvent.layout;
        }

        React.useEffect(() => {
          if (state.index == index) {
            widthAnimated.value = { flex: 0 };
          } else {
            widthAnimated.value = { flex: 1 };
          }
        }, [state.index]);

        const widthAnimationStyle = useAnimatedStyle(() => {
          return {
            flex: withTiming(widthAnimated.value.flex, { duration: 0}),
          };
        });

        const bottomTabIcon = useCallback(() => {
          switch (index) {
            case 0:
              return isFocused ? <HomeSolidIconMemo color={colors.primary} /> : <HomeLineIconMemo />;
            case 1:
              return isFocused ? <SearchSolidIconMemo color={colors.primary} /> : <SearchLineIconMemo />;
            case 2:
              return isFocused ?
                <WishListSolidIconMemo color={colors.primary} />
                : <View
                  style={{
                    width: 24,
                    height: 24,
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <WishListLineIconMemo />
                </View>;
            case 3:
              return isFocused ? <CartSolidIconMemo color={colors.primary} /> : <CartLineIconMemo />;
            case 4:
              return isFocused ? <AccountSolidIconMemo color={colors.primary} /> : <AccountLineIconMemo />;
            default:
              return isFocused ? <SearchSolidIconMemo color={colors.primary} /> : <SearchLineIconMemo />;
          }
        }, [index, isFocused]);

        return (
          <Animated.View
            key={route.key}
            onLayout={onLayout}
            style={[
              isFocused ?
                [
                  styles.containerFocus,
                  widthAnimationStyle
                ]
                : styles.containerDefault
            ]}>
            <TouchableOpacity
            activeOpacity={state.index === index ? 1 : 0.6}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() => state.index != index && onPress()}
            onLongPress={onLongPress}
            style={styles.hero}>
            {bottomTabIcon()}
            {
              <Text style={{ color: isFocused ? colors.primary : colors.gray, fontSize: 12 }}>
                {translate(label)}
              </Text>
            }
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

export default TabBottomBarCustom

const useStyle = (colors: AppThemeColors) => StyleSheet.create({
  containerFocus: {
    width: "20%",
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerDefault: {
    width: "20%",
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
