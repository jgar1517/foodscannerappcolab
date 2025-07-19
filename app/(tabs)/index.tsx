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
import { Camera, Shield, Zap, Users, TrendingUp } from 'lucide-react-native';
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

export default function HomeScreen() {
  const router = useRouter();

  const handleScanPress = () => {
    router.push('/scan');
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
});