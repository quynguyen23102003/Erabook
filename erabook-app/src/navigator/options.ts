import { CardStyleInterpolators, StackNavigationOptions } from "@react-navigation/stack";

export const defaultOptions: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
  cardOverlayEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
};

export const cardBottomSheetStyleOptions: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
  cardOverlayEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
  gestureDirection: 'vertical',
};
