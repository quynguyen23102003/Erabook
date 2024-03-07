import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { LoadingLotteAnimation } from "@assets/Icon";
import { useAppTheme } from "@themes/theme.config";

export const FooterListLoading = () => {
  const { colors } = useAppTheme();
  return (
    <View style={styles.center}>
      <LottieView
        style={{ width: 62, height: 62 }}
        loop
        autoPlay
        source={LoadingLotteAnimation.loadingLoadMore}
        colorFilters={[
          {
            keypath: "Shape Layer 2",
            color: colors.primary
          }
        ]} />
    </View>
  );
};
const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  }
});
