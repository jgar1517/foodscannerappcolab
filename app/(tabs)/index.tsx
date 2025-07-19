import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Shield, Zap, Users, TrendingUp, ChevronRight, Sparkles, Star, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const floatAnim = React.useRef(new Animated.Value(0)).current;

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
  }, []);

  const handleScanPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => {
      router.push('/scan');
    }, 200);
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#22C55E', '#16A34A', '#15803D']}
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.View
              style={[
                styles.heroContent,
                {
                  transform: [{ translateY: floatingTransform }],
                },
              ]}
            >
              <Text style={styles.heroTitle}>Scan with</Text>
              <Text style={styles.heroSubtitle}>Confidence</Text>
              
              <Text style={styles.heroDescription}>
                AI-powered ingredient safety analysis at your fingertips. Make informed dietary decisions with trusted scientific insights.
              </Text>
              
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity 
                  style={styles.scanButton}
                  onPress={handleScanPress}
                  activeOpacity={0.9}
                >
                  <View style={styles.scanButtonContent}>
                    <Camera size={20} color="#22C55E" />
                    <Text style={styles.scanButtonText}>Start Scanning</Text>
                    <ChevronRight size={16} color="#22C55E" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>

          {/* Why Choose Section */}
          <Animated.View
            style={[
              styles.whyChooseSection,
              {
                transform: [{ translateY: floatingTransform }],
              },
            ]}
          >
            <BlurView intensity={20} style={styles.whyChooseBlur}>
              <Text style={styles.whyChooseTitle}>Why Choose Food Safety Scanner?</Text>
            </BlurView>
          </Animated.View>

          {/* How It Works Section */}
          <View style={styles.howItWorksSection}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            
            <View style={styles.stepsContainer}>
              <Animated.View
                style={[
                  styles.step,
                  {
                    transform: [{ translateY: floatingTransform }],
                  },
                ]}
              >
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Scan or Upload</Text>
                  <Text style={styles.stepDescription}>Take a photo of any ingredient label or upload from your gallery</Text>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.step,
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
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>AI Analysis</Text>
                  <Text style={styles.stepDescription}>Our AI identifies each ingredient and cross-references safety databases</Text>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.step,
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
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Get Results</Text>
                  <Text style={styles.stepDescription}>Receive safety ratings, explanations, and healthier alternatives</Text>
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Trusted By Section */}
          <View style={styles.trustedSection}>
            <Text style={styles.sectionTitle}>Trusted by Health Professionals</Text>
            
            <View style={styles.trustedItems}>
              <Animated.View
                style={[
                  styles.trustedItem,
                  {
                    transform: [{ translateY: floatingTransform }],
                  },
                ]}
              >
                <CheckCircle size={16} color="#ffffff" />
                <Text style={styles.trustedText}>FDA Database Integration</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.trustedItem,
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
                <CheckCircle size={16} color="#ffffff" />
                <Text style={styles.trustedText}>EWG Food Scores</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.trustedItem,
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
                <CheckCircle size={16} color="#ffffff" />
                <Text style={styles.trustedText}>Scientific Research Backed</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.trustedItem,
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
                <CheckCircle size={16} color="#ffffff" />
                <Text style={styles.trustedText}>Regular Database Updates</Text>
              </Animated.View>
            </View>
          </View>

          {/* Ready to Eat Section */}
          <Animated.View
            style={[
              styles.readySection,
              {
                transform: [{ translateY: floatingTransform }],
              },
            ]}
          >
            <BlurView intensity={20} style={styles.readySectionBlur}>
              <Text style={styles.readyTitle}>Ready to eat with confidence?</Text>
              <Text style={styles.readySubtitle}>Join thousands of users making safer food choices every day</Text>
              
              <TouchableOpacity 
                style={styles.startButton}
                onPress={handleScanPress}
                activeOpacity={0.9}
              >
                <Text style={styles.startButtonText}>Start Your First Scan</Text>
              </TouchableOpacity>
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
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '300',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
  whyChooseSection: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  whyChooseBlur: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  whyChooseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  howItWorksSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  stepsContainer: {
    gap: 24,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  trustedSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  trustedItems: {
    gap: 16,
  },
  trustedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustedText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  readySection: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  readySectionBlur: {
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  readyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  readySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
  bottomSpacing: {
    height: 40,
  },
});