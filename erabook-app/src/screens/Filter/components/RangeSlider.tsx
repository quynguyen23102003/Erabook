import { StyleSheet, Text, TextInput, View, TextInputProps } from 'react-native'
import React from 'react'
import { AppThemeColors, useAppTheme } from '@themes/theme.config';
import { Popins } from '@components/popins';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, useAnimatedProps, runOnJS } from 'react-native-reanimated';

interface RangeSliderProps {
    sliderWidth: number;
    min: number;
    max: number;
    step: number;
    onValueChange: (range: { min: number; max: number }) => void;
}
const RangeSlider: React.FC<RangeSliderProps> = ({ sliderWidth, min, max, step, onValueChange }) => {
    const { colors } = useAppTheme();
    const styles = useStyle(colors);
    const position = useSharedValue(0);
    const position2 = useSharedValue(sliderWidth);
    const zIndex = useSharedValue(0);
    const zIndex2 = useSharedValue(0);
    const opacity = useSharedValue(0);
    const opacity2 = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = position.value;
        },
        onActive: (e, ctx) => {
            opacity.value = 1;
            if (ctx.startX + e.translationX < 0) {
                position.value = 0;
            } else if (ctx.startX + e.translationX > position2.value) {
                position.value = position2.value;
                zIndex.value = 1;
                zIndex2.value = 0;
            } else {
                position.value = ctx.startX + e.translationX;
            }
        },
        onEnd: () => {
            opacity.value = 0;
            runOnJS(onValueChange)({
                min:
                    min +
                    Math.floor(position.value / (sliderWidth / ((max - min) / step))) *
                    step,
                max:
                    min +
                    Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
                    step,
            });
        }
    })
    const gestureHandler2 = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = position2.value;
        },
        onActive: (e, ctx) => {
            opacity2.value = 1;
            if (ctx.startX + e.translationX > sliderWidth) {
                position2.value = sliderWidth;
            } else if (ctx.startX + e.translationX < position.value) {
                position2.value = position.value;
                zIndex.value = 0;
                zIndex2.value = 1;
            } else {
                position2.value = ctx.startX + e.translationX;
            }
        },
        onEnd: () => {
            opacity2.value = 0;
            runOnJS(onValueChange)({
                min:
                    min +
                    Math.floor(position.value / (sliderWidth / ((max - min) / step))) *
                    step,
                max:
                    min +
                    Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
                    step,
            });
        }
    })
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
        zIndex: zIndex.value,
    }));
    const animatedStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateX: position2.value }],
        zIndex: zIndex2.value,
    }));
    const opacityStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));
    const opacityStyle2 = useAnimatedStyle(() => ({
        opacity: opacity2.value,
    }));
    const sliderStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
        width: position2.value - position.value,
    }));
    const AnimatedTextInput = Animated.createAnimatedComponent<TextInputProps>(TextInput);
    const minLabelText = useAnimatedProps(() => {
        const formattedValue = (
            min +
            Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step
        ).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        console.log("=====>", formattedValue);
    
        return {
            text: formattedValue,
        };
    });
    console.log("=====> min", minLabelText.text);
    const maxLabelText = useAnimatedProps(() => {
        const formattedValueMax = (
            min +
            Math.floor(position2.value / (sliderWidth / ((max - min) / step))) * step
        ).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    
        return {
            text: formattedValueMax,
        };
    });

    return (
        <View style={[styles.container, { width: sliderWidth }]}>
            <View style={[styles.sliderBack, { width: sliderWidth }]} />
            <Animated.View style={[styles.sliderFront, sliderStyle]} />
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.thumb, animatedStyle]}>
                    <Animated.View style={[styles.label, opacityStyle]}>
                        <AnimatedTextInput
                            style={styles.labelText}
                            // animatedProps={minLabelText}
                            editable={false}
                            defaultValue={'$0'}
                            value={minLabelText.text}
                        />
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>
            <PanGestureHandler onGestureEvent={gestureHandler2}>
                <Animated.View style={[styles.thumb, animatedStyle2]}>
                    <Animated.View style={[styles.label, opacityStyle2]}>
                        <AnimatedTextInput
                            style={styles.labelText}
                            // animatedProps={maxLabelText}
                            editable={false}
                            defaultValue={'$500'}
                        />
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    )
}

export default RangeSlider

const useStyle = (colors: AppThemeColors) => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    sliderBack: {
        height: 8,
        backgroundColor: colors.backgroundCategory,
        borderRadius: 20,
    },
    sliderFront: {
        height: 7,
        backgroundColor: colors.primary,
        borderRadius: 20,
        position: 'absolute'
    },
    thumb: {
        position: 'absolute',
        left: -10,
        width: 18,
        height: 18,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 4,
        borderColor: colors.primary,
    },
    label: {
        position: 'absolute',
        top: -40,
        bottom: 20,
        backgroundColor: colors.primary,
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelText: {
        color: '#ffffff',
        padding: 5,
        fontFamily: Popins[500],
        width: '100%',
        fontSize: 14
    }
})