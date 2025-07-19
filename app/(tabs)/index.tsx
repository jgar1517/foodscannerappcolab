import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Shield, Zap, Users, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const features = [
  {
    icon: Shield,
    title: 'AI-Powered Safety Analysis',
    description: 'Get instant safety ratings for every ingredient based on trusted scientific sources',
    color: '#22C55E',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Scan any ingredient label and get results in under 5 seconds',
    color: '#fbbf24',
  },
  {
    icon: Users,
    title: 'Personalized for You',
    description: 'Custom dietary profiles adapt safety ratings to your specific needs',
    color: '#8b5cf6',
  },
  {
    icon: TrendingUp,
    title: 'Smart Recommendations',
    description: 'Discover healthier alternatives and simple recipes using safer ingredients',
    color: '#ef4444',
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

  const handleScanPress = () => {
    router.push('/scan');
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Food Scanner App
            </Text>
            <Text style={styles.heroSubtitle}>
              AI-powered ingredient safety analysis at your fingertips. Make informed dietary decisions with trusted scientific insights.
            </Text>
            
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={handleScanPress}
              activeOpacity={0.9}
            >
              <Text style={styles.scanButtonText}>SCAN FOOD</Text>
            </TouchableOpacity>
            
            {/* How To Steps */}
            <View style={styles.howToSection}>
              <Text style={styles.howToTitle}>How it works in 3 easy steps:</Text>
              <View style={styles.stepsContainer}>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.stepText}>Take a photo of the ingredient label</Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.stepText}>Get instant safety ratings for each ingredient</Text>
                </View>
                <View style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepText}>Discover healthier alternatives and recipes</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Food Safety Scanner?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                  <feature.icon size={24} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqQuestion}
                  onPress={() => toggleFaq(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} color="#15803D" />
                  ) : (
                    <ChevronDown size={20} color="#15803D" />
                  )}
                </TouchableOpacity>
                {expandedFaq === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#14532D',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: '#15803D',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  howToSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  howToTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14532D',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 16,
    alignItems: 'flex-start',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 300,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#15803D',
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
    color: '#6b7280',
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#ffffff',
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#14532D',
    marginBottom: 24,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14532D',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 20,
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
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
    color: '#14532D',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  faqAnswerText: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
  },
});