import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, Star, Leaf } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function ResultsScreen() {
  const router = useRouter();
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scale in animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.backgroundGradient}
      />

      {/* Floating particles */}
      <View style={styles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: Math.random() * 400,
                top: Math.random() * 800,
                transform: [
                  {
                    translateY: floatingTransform,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <BlurView intensity={20} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#F8FAFC" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Sparkles size={20} color="#60A5FA" />
            <Text style={styles.headerTitle}>Results</Text>
            <Star size={20} color="#F59E0B" />
          </View>
        </BlurView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Result Card */}
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ scale: scaleAnim }, { translateY: floatingTransform }],
              },
            ]}
          >
            <BlurView intensity={30} style={styles.cardBlur}>
              {/* Broccoli Illustration */}
              <View style={styles.imageContainer}>
                <Animated.View
                  style={[
                    styles.broccoli,
                    {
                      transform: [
                        {
                          translateY: floatAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -5],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#86EFAC', '#22C55E']}
                    style={styles.broccoliStem}
                  />
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.broccoliTop}
                  />
                  <LinearGradient
                    colors={['#16A34A', '#15803D']}
                    style={[styles.broccoliFloret, styles.floret1]}
                  />
                  <LinearGradient
                    colors={['#16A34A', '#15803D']}
                    style={[styles.broccoliFloret, styles.floret2]}
                  />
                  <LinearGradient
                    colors={['#16A34A', '#15803D']}
                    style={[styles.broccoliFloret, styles.floret3]}
                  />
                </Animated.View>
              </View>
              
              {/* Title and Badge */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Broccoli</Text>
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  style={styles.healthyBadge}
                >
                  <Text style={styles.healthyText}>Healthy</Text>
                </LinearGradient>
              </View>
              
              {/* Nutrition Facts */}
              <Text style={styles.label}>Nutrition Facts</Text>
              <LinearGradient
                colors={['#22C55E', '#16A34A']}
                style={styles.divider}
              />
              <View style={styles.factsContainer}>
                <Text style={styles.fact}>Calories: 9 cal</Text>
                <Text style={styles.fact}>Per Serving: 12%</Text>
              </View>
              
              {/* Tags */}
              <View style={styles.tags}>
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  style={styles.chip}
                >
                  <View style={styles.leafIconContainer}>
                    <Leaf size={12} color="#ffffff" />
                  </View>
                  <Text style={styles.chipText}>Vegan</Text>
                </LinearGradient>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.gfChip}
                >
                  <Text style={styles.gfText}>GF</Text>
                </LinearGradient>
              </View>
            </BlurView>
          </Animated.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#60A5FA',
    borderRadius: 1.5,
    opacity: 0.7,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBlur: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  broccoli: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  broccoliStem: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 30,
    borderRadius: 8,
  },
  broccoliTop: {
    position: 'absolute',
    top: 10,
    left: '50%',
    marginLeft: -25,
    width: 50,
    height: 40,
    borderRadius: 25,
  },
  broccoliFloret: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  floret1: {
    top: 5,
    left: 15,
  },
  floret2: {
    top: 5,
    right: 15,
  },
  floret3: {
    top: 20,
    left: '50%',
    marginLeft: -10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  healthyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  healthyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
    color: '#22C55E',
    fontSize: 16,
  },
  divider: {
    height: 2,
    marginVertical: 8,
    borderRadius: 1,
  },
  factsContainer: {
    marginBottom: 16,
  },
  fact: {
    fontSize: 16,
    marginVertical: 2,
    color: '#CBD5E1',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  leafIconContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  gfChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gfText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  bottomSpacing: {
    height: 40,
  },
});