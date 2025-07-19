import React from 'react';
import {
  Text,
  Animated,
  TextStyle,
} from 'react-native';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  style?: TextStyle;
  formatter?: (value: number) => string;
}

export default function AnimatedCounter({
  value,
  duration = 1000,
  style,
  formatter = (val) => Math.round(val).toString(),
}: AnimatedCounterProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const listener = animatedValue.addListener(({ value: animValue }) => {
      setDisplayValue(animValue);
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, duration]);

  return (
    <Text style={style}>
      {formatter(displayValue)}
    </Text>
  );
}