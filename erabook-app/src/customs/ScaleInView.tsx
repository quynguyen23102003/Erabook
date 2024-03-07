import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';

const ScaleInView = (props: any) => {
    const [scaleAnim] = useState(new Animated.Value(0))  // Initial value for scale: 0

    React.useEffect(() => {
        Animated.spring(
            scaleAnim,
            {
                toValue: 1,
                friction: 3,
                useNativeDriver: true
            }
        ).start();
    }, [])

    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                transform: [{ scale: scaleAnim }]
            }}
        >
            {props.children}
        </Animated.View>
    );
}