import React from 'react';
import {
  View,
  Animated,
  ViewStyle,
} from 'react-native';

interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
  style?: ViewStyle;
}

export default function StaggeredList({
  children,
  staggerDelay = 100,
  initialDelay = 0,
  style,
}: StaggeredListProps) {
  const animations = React.useRef(
    children.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  ).current;

  React.useEffect(() => {
    const animationSequence = children.map((_, index) =>
      Animated.parallel([
        Animated.timing(animations[index].opacity, {
          toValue: 1,
          duration: 600,
          delay: initialDelay + index * staggerDelay,
          useNativeDriver: false,
        }),
        Animated.spring(animations[index].translateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          delay: initialDelay + index * staggerDelay,
          useNativeDriver: false,
        }),
      ])
    );

    Animated.stagger(0, animationSequence).start();
  }, [children.length]);

  return (
    <View style={style}>
      {children.map((child, index) => (
        <Animated.View
          key={index}
          style={{
            opacity: animations[index]?.opacity || 1,
            transform: [
              {
                translateY: animations[index]?.translateY || 0,
              },
            ],
          }}
        >
          {child}
        </Animated.View>
      ))}
    </View>
  );
}