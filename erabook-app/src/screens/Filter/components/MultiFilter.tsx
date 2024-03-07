import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Popins } from '@components/popins';

interface RangeSliderProps {
  sliderWidth: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (range: { min: number; max: number }) => void;
}

const MultiFilter: React.FC<RangeSliderProps> = ({ sliderWidth, min, max, step, onValueChange }) => {
  const { colors } = useAppTheme();
  const styles = useStyle(colors);
  const handleValuesChange = (values: number[]) => {
    const newMin = values[0];
    const newMax = values[1];
    onValueChange({ min: newMin, max: newMax });
  };
  return (
    <View>
      <MultiSlider
        allowOverlap
        sliderLength={sliderWidth}
        min={0}
        max={max}
        step={step}
        values={[min, max]}
        selectedStyle={{
          backgroundColor: colors.primary,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderTopLeftRadius: 20,
          paddingHorizontal: 28
        }}
        unselectedStyle={styles.slider}
        containerStyle={styles.slider}
        onValuesChangeFinish={handleValuesChange}
        markerOffsetX={0}
        markerOffsetY={12}
        trackStyle={{ height: 20 }}
        isMarkersSeparated={true}
        customMarkerLeft={(e) => (
          <Text style={[styles.label, {marginLeft: 28}]}>
            {e.currentValue.toFixed(0)}
          </Text>
        )}
        customMarkerRight={(e) => (
          <Text style={[styles.label, {marginRight: 28}]}>
            {e.currentValue.toFixed(0)}
          </Text>
        )}
      />
    </View>
  )
}

export default MultiFilter

const useStyle = (colors: AppThemeColors) => StyleSheet.create({
  slider: {
    backgroundColor: colors.backgroundCategory,
    height: 'auto',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  label: {
    color: colors.text, 
    fontFamily: Popins[500],
    fontSize: 14
  }
})