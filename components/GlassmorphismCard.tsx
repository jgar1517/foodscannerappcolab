import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderRadius?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  elevation?: number;
  animated?: boolean;
}

export default function GlassmorphismCard({
  children,
  style,
  intensity = 20,
  borderRadius = 20,
  shadowColor = '#8B5CF6',
  shadowOpacity = 0.3,
  elevation = 8,
  animated = true,
}: GlassmorphismCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const shadowAnim = React.useRef(new Animated.Value(shadowOpacity)).current;

  const handlePressIn = () => {
    if (!animated) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: shadowOpacity * 1.5,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (!animated) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: shadowOpacity,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderRadius,
          transform: [{ scale: scaleAnim }],
          shadowColor,
          shadowOpacity: animated ? shadowAnim : shadowOpacity,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          elevation,
        },
        style,
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      {/* Gradient Border */}
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.3)', 'rgba(124, 58, 237, 0.1)', 'rgba(139, 92, 246, 0.3)']}
        style={[styles.gradientBorder, { borderRadius }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Glass Effect */}
        <View
          style={[
            styles.glassContainer,
            {
              borderRadius: borderRadius - 1,
            },
          ]}
        >
          {/* Content Background */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.15)',
              'rgba(255, 255, 255, 0.05)',
              'rgba(255, 255, 255, 0.1)',
            ]}
            style={[
              styles.contentBackground,
              {
                borderRadius: borderRadius - 1,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {children}
          </LinearGradient>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 1,
  },
  glassContainer: {
    overflow: 'hidden',
    backgroundColor: 'rgba(42, 26, 62, 0.3)',
  },
  contentBackground: {
    overflow: 'hidden',
  },
});