import { View } from "react-native";
import React, { useMemo } from "react";
import { useAppTheme } from "../../themes/theme.config";

interface Props {
  color?: string;
  indicatorHeight?: number;
  indicatorWidth?: number;
  marginVertical?: number;
  marginHorizontal?: number;
}

export const Indicator: React.FC<Props> = ({
                                             color,
                                             indicatorHeight,
                                             indicatorWidth,
                                             marginHorizontal,
                                             marginVertical
                                           }) => {
  const { colors } = useAppTheme();
  const height = useMemo(() => indicatorHeight || 4, [indicatorHeight]);
  const width = useMemo(() => indicatorWidth || 100, [indicatorWidth]);
  const marginV = useMemo(() => marginVertical || 8, [marginVertical]);
  const marginH = useMemo(() => marginHorizontal || 0, [marginHorizontal]);
  const indicatorColor = useMemo(() => color || colors.primary, [color]);

  return (
    <View style={{
      width: width,
      height: height,
      backgroundColor: indicatorColor,
      borderRadius: 50,
      alignSelf: "center",
      marginVertical: marginV,
      marginHorizontal: marginH
    }} />
  );
};
