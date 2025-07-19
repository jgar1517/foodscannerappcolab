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
import { Camera, Shield, Zap, Users, TrendingUp, ChevronDown, ChevronUp, Sparkles, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const features = [
  {
    icon: Shield,
    title: 'AI-Powered Safety Analysis',
    description: 'Get instant safety ratings for every ingredient based on trusted scientific sources',
    color: '#22C55E',
    gradient: ['#22C55E', '#16A34A'],
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Scan any ingredient label and get results in under 5 seconds',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
  },
  {
    icon: Users,
    title: 'Personalized for You',
    description: 'Custom dietary profiles adapt safety ratings to your specific needs',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
  },
  {
    icon: TrendingUp,
    title: 'Smart Recommendations',
    description: 'Discover healthier alternatives and simple recipes using safer ingredients',
    color: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
  },
];

const faqs = [
  {
    question: 'How accurate is the ingredient analysis?',
    answer: 'Our AI-powered system achieves 95% accuracy by combining multiple trusted sources including FDA databases, EWG Food Scores, and scientific research. We continuously update our database to ensure the most current safety information.',
  },
  {
    question: 'Can I use this app for dietary restrictions?',
    answer: 'Yes! The app supports various dietary profiles including gluten-free, vegan, diabetic-friendly, and custom restrictions. Safety ratings are personalized based on your specific dietary needs and preferences.',
  },
  {
    question: 'How does the scanning process work?',
    answer: 'Simply take a photo of any ingredient label. Our OCR technology extracts the text, identifies each ingredient, and provides instant safety ratings with explanations. The entire process takes less than 5 seconds.',
  },
  {
    question: 'Is my data secure and private?',
    answer: 'Absolutely. We use end-to-end encryption for all data transmission and storage. Your personal dietary information is never shared with third parties, and you have full control over your data.',
  },
  {
    question: 'What sources do you use for safety ratings?',
    answer: 'We aggregate data from trusted sources including the FDA, EWG Food Scores Database, USDA Food Database, and peer-reviewed scientific research to provide comprehensive safety assessments.',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);
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

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
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
                left: Math.random() * width,
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
              <View style={styles.titleContainer}>
                <Sparkles size={32} color="#60A5FA" style={styles.sparkleIcon} />
                <Text style={styles.heroTitle}>Food Scanner App</Text>
                <Star size={24} color="#F59E0B" style={styles.starIcon} />
              </View>
              
              <Text style={styles.heroSubtitle}>
                AI-powered ingredient safety analysis at your fingertips. Make informed dietary decisions with trusted scientific insights.
              </Text>
              
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity 
                  style={styles.scanButton}
                  onPress={handleScanPress}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#3B82F6', '#1D4ED8']}
                    style={styles.scanButtonGradient}
                  >
                    <Camera size={20} color="#ffffff" />
                    <Text style={styles.scanButtonText}>SCAN FOOD</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              
              {/* How To Steps */}
              <View style={styles.howToSection}>
                <Text style={styles.howToTitle}>How it works in 3 easy steps:</Text>
                <View style={styles.stepsContainer}>
                  {[
                    'Take a photo of the ingredient label',
                    'Get instant safety ratings for each ingredient',
                    'Discover healthier alternatives and recipes'
                  ].map((step, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.step,
                        {
                          transform: [
                            {
                              translateY: floatAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -5 * (index + 1)],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <BlurView intensity={20} style={styles.stepBlur}>
                        <LinearGradient
                          colors={['#3B82F6', '#1E40AF']}
                          style={styles.stepNumber}
                        >
                          <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </LinearGradient>
                        <Text style={styles.stepText}>{step}</Text>
                      </BlurView>
                    </Animated.View>
                  ))}
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose Food Safety Scanner?</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.featureCard,
                    {
                      transform: [
                        {
                          translateY: floatAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -8 * (index % 2 === 0 ? 1 : -1)],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <BlurView intensity={30} style={styles.featureBlur}>
                    <LinearGradient
                      colors={feature.gradient}
                      style={styles.featureIcon}
                    >
                      <feature.icon size={24} color="#ffffff" />
                    </LinearGradient>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </BlurView>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqContainer}>
              {faqs.map((faq, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.faqItem,
                    {
                      transform: [
                        {
                          translateY: floatAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -3 * index],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <BlurView intensity={25} style={styles.faqBlur}>
                    <TouchableOpacity 
                      style={styles.faqQuestion}
                      onPress={() => toggleFaq(index)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.faqQuestionText}>{faq.question}</Text>
                      {expandedFaq === index ? (
                        <ChevronUp size={20} color="#60A5FA" />
                      ) : (
                        <ChevronDown size={20} color="#60A5FA" />
                      )}
                    </TouchableOpacity>
                    {expandedFaq === index && (
                      <View style={styles.faqAnswer}>
                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                      </View>
                    )}
                  </BlurView>
                </Animated.View>
              ))}
            </View>
          </View>

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
    width: 4,
    height: 4,
    backgroundColor: '#60A5FA',
    borderRadius: 2,
    opacity: 0.6,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sparkleIcon: {
    marginRight: 12,
  },
  starIcon: {
    marginLeft: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  scanButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  howToSection: {
    marginTop: 48,
    alignItems: 'center',
  },
  howToTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 24,
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 16,
    alignItems: 'flex-start',
  },
  step: {
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
  },
  stepBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  stepText: {
    fontSize: 16,
    color: '#E2E8F0',
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  featureBlur: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 22,
  },
  faqContainer: {
    gap: 16,
  },
  faqItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  faqBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  faqAnswerText: {
    fontSize: 15,
    color: '#CBD5E1',
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 40,
  },
});