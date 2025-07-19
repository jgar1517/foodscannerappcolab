import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SuccessAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

export default function SuccessAnimation({ visible, onComplete }: SuccessAnimationProps) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const particleAnims = React.useRef(
    Array.from({ length: 12 }, () => ({
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  React.useEffect(() => {
    if (visible) {
      // Main circle animation
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Particle explosion
        Animated.parallel([
          ...particleAnims.map((anim, index) => {
            const angle = (index * 360) / particleAnims.length;
            const distance = 100;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;

            return Animated.parallel([
              Animated.spring(anim.scale, {
                toValue: 1,
                tension: 50,
                friction: 6,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateX, {
                toValue: x,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateY, {
                toValue: y,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ]);
          }),
        ]),
      ]).start(() => {
        // Reset animations
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
        particleAnims.forEach(anim => {
          anim.scale.setValue(0);
          anim.translateX.setValue(0);
          anim.translateY.setValue(0);
          anim.opacity.setValue(1);
        });
        onComplete?.();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Main success circle */}
      <Animated.View
        style={[
          styles.successCircle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <LinearGradient
          colors={['#22C55E', '#16A34A']}
          style={styles.circleGradient}
        >
          <View style={styles.checkmark}>
            <View style={styles.checkmarkStem} />
            <View style={styles.checkmarkKick} />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Particle explosion */}
      {particleAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { scale: anim.scale },
                { translateX: anim.translateX },
                { translateY: anim.translateY },
              ],
              opacity: anim.opacity,
            },
          ]}
        >
          <LinearGradient
            colors={index % 2 === 0 ? ['#A78BFA', '#8B5CF6'] : ['#C084FC', '#A855F7']}
            style={styles.particleGradient}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 32,
    height: 32,
    position: 'relative',
  },
  checkmarkStem: {
    position: 'absolute',
    width: 3,
    height: 16,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
    left: 12,
    top: 8,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkKick: {
    position: 'absolute',
    width: 3,
    height: 8,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
    left: 8,
    top: 16,
    transform: [{ rotate: '-45deg' }],
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  particleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});