import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import StaggeredList from '@/components/StaggeredList';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function HomeScreen() {
  const router = useRouter();
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartScanning = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/scan');
  };

  const handleStartFirstScan = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/scan');
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2A1A3E', '#3D2A52', '#503A66']}
        style={styles.backgroundGradient}
      />

      {/* Floating particles */}
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <Animated.View 
            style={[
              styles.heroSection,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.heroContent,
                {
                  transform: [{ translateY: floatingTransform }],
                },
              ]}
            >
              <Text style={styles.heroTitle}>Scan with</Text>
              <Text style={styles.heroDescription}>
                AI-powered ingredient safety analysis at your fingertips. Make informed dietary decisions with trusted scientific insights.
              </Text>
              
              <Animated.View
                style={[
                  styles.startButtonContainer,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => router.push('/scan')}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.startButtonGradient}
                  >
                    <Camera size={20} color="#ffffff" />
                    <Text style={styles.startButtonText}>Start Scanning</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </Animated.View>

          {/* Why Choose Section */}
          <GlassmorphismCard
            style={[
              styles.whyChooseSection,
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
            <View style={styles.whyChooseContent}>
              <Text style={styles.whyChooseTitle}>Why Choose Food Safety Scanner?</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <AnimatedCounter value={50000} style={styles.statNumber} />
                  <Text style={styles.statLabel}>Ingredients Analyzed</Text>
                </View>
                <View style={styles.statItem}>
                  <AnimatedCounter value={98} style={styles.statNumber} formatter={(val) => `${Math.round(val)}%`} />
                  <Text style={styles.statLabel}>Accuracy Rate</Text>
                </View>
                <View style={styles.statItem}>
                  <AnimatedCounter value={25000} style={styles.statNumber} />
                  <Text style={styles.statLabel}>Happy Users</Text>
                </View>
              </View>
            </View>
          </GlassmorphismCard>

          {/* How It Works Section */}
          <GlassmorphismCard
            style={[
              styles.howItWorksSection,
              {
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -3],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.howItWorksContent}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              
              <StaggeredList staggerDelay={200} initialDelay={300}>
                <View style={styles.stepItem}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.stepNumber}
                  >
                    <Text style={styles.stepNumberText}>1</Text>
                  </LinearGradient>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Scan or Upload</Text>
                    <Text style={styles.stepDescription}>
                      Take a photo of any ingredient label or upload from your gallery
                    </Text>
                  </View>
                </View>
                <View style={styles.stepItem}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.stepNumber}
                  >
                    <Text style={styles.stepNumberText}>2</Text>
                  </LinearGradient>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>AI Analysis</Text>
                    <Text style={styles.stepDescription}>
                      Our AI identifies each ingredient and cross-references safety databases
                    </Text>
                  </View>
                </View>
                <View style={styles.stepItem}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.stepNumber}
                  >
                    <Text style={styles.stepNumberText}>3</Text>
                  </LinearGradient>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Get Results</Text>
                    <Text style={styles.stepDescription}>
                      Receive safety ratings, explanations, and healthier alternatives
                    </Text>
                  </View>
                </View>
              </StaggeredList>
            </View>
          </GlassmorphismCard>

          {/* Trusted By Section */}
          <GlassmorphismCard
            style={[
              styles.trustedSection,
              {
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -2],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.trustedContent}>
              <Text style={styles.sectionTitle}>Trusted by Health Professionals</Text>
              
              <StaggeredList staggerDelay={150} initialDelay={500}>
                <View style={styles.trustedItem}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.trustedIcon}
                  >
                    <CheckCircle size={16} color="#ffffff" />
                  </LinearGradient>
                  <Text style={styles.trustedText}>FDA Database Integration</Text>
                </View>
                <View style={styles.trustedItem}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.trustedIcon}
                  >
                    <CheckCircle size={16} color="#ffffff" />
                  </LinearGradient>
                  <Text style={styles.trustedText}>EWG Food Scores</Text>
                </View>
                <View style={styles.trustedItem}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.trustedIcon}
                  >
                    <CheckCircle size={16} color="#ffffff" />
                  </LinearGradient>
                  <Text style={styles.trustedText}>Scientific Research Backed</Text>
                </View>
                <View style={styles.trustedItem}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.trustedIcon}
                  >
                    <CheckCircle size={16} color="#ffffff" />
                  </LinearGradient>
                  <Text style={styles.trustedText}>Regular Database Updates</Text>
                </View>
              </StaggeredList>
            </View>
          </GlassmorphismCard>

          {/* CTA Section */}
          <GlassmorphismCard
            style={[
              styles.ctaSection,
              {
                transform: [{ translateY: floatingTransform }],
              },
            ]}
          >
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Ready to eat with confidence?</Text>
              <Text style={styles.ctaDescription}>
                Join thousands of users making safer food choices every day
              </Text>
              
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={handleStartFirstScan}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.ctaButtonGradient}
                >
                  <Text style={styles.ctaButtonText}>Start Your First Scan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassmorphismCard>

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
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  heroDescription: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  startButtonContainer: {
    borderRadius: 25,
  },
  startButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
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
  whyChooseSection: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  whyChooseContent: {
    padding: 20,
  },
  whyChooseTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  howItWorksSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  howItWorksContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  trustedSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  trustedContent: {
    padding: 20,
  },
  trustedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  trustedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustedText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  ctaSection: {
    marginHorizontal: 24,
    marginBottom: 40,
  },
  ctaContent: {
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  ctaDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.2,
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  ctaButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  ctaButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  bottomSpacing: {
    height: 40,
  },
});