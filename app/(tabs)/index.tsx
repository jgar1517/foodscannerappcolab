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

        {/* Color Palette Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Palette</Text>
          <View style={styles.colorPalette}>
            <View style={[styles.colorSwatch, { backgroundColor: '#14532D' }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#15803D' }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#22C55E' }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#4ADE80' }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#86EFAC' }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#BBF7D0' }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#DCFCE7' }]} />
          </View>
        </View>

        {/* Typography Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Typography</Text>
          <View style={styles.typographyExamples}>
            <View style={styles.buttonExample}>
              <Text style={styles.buttonExampleText}>SCAN FOOD</Text>
            </View>
            <TouchableOpacity style={styles.cameraButtonExample}>
              <Camera size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Components Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Components</Text>
          <View style={styles.componentsGrid}>
            {/* Scan Food Component */}
            <View style={styles.componentCard}>
              <View style={styles.scanComponent}>
                <View style={styles.scanFrame}>
                  <View style={styles.appleIcon}>
                    <View style={styles.appleBody} />
                    <View style={styles.appleLeaf} />
                  </View>
                </View>
                <Text style={styles.componentLabel}>SCAN FOOD</Text>
              </View>
              <Text style={styles.componentTitle}>Theme exmust</Text>
            </View>

            {/* Broccoli Result Component */}
            <View style={styles.componentCard}>
              <View style={styles.resultComponent}>
                <View style={styles.broccoliIcon}>
                  <View style={styles.broccoliStem} />
                  <View style={styles.broccoliTop} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>Broccoli</Text>
                  <View style={styles.healthyBadge}>
                    <Text style={styles.healthyText}>Healthy</Text>
                  </View>
                  <View style={styles.tagRow}>
                    <View style={styles.veganTag}>
                      <Text style={styles.tagText}>🌿</Text>
                    </View>
                    <View style={styles.gfTag}>
                      <Text style={styles.gfTagText}>GF</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.componentTitle}>Theme switch</Text>
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
  colorPalette: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typographyExamples: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  buttonExample: {
    backgroundColor: '#15803D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonExampleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  cameraButtonExample: {
    backgroundColor: '#15803D',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  componentsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  componentCard: {
    flex: 1,
    alignItems: 'center',
  },
  scanComponent: {
    backgroundColor: '#15803D',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  scanFrame: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appleIcon: {
    position: 'relative',
    width: 40,
    height: 40,
  },
  appleBody: {
    width: 40,
    height: 35,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  appleLeaf: {
    position: 'absolute',
    top: -3,
    right: 12,
    width: 12,
    height: 8,
    backgroundColor: '#22C55E',
    borderRadius: 6,
    transform: [{ rotate: '45deg' }],
  },
  componentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  resultComponent: {
    backgroundColor: '#DCFCE7',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    width: '100%',
  },
  broccoliIcon: {
    width: 40,
    height: 40,
    position: 'relative',
    marginBottom: 12,
    alignSelf: 'center',
  },
  broccoliStem: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 15,
    backgroundColor: '#86EFAC',
    borderRadius: 4,
  },
  broccoliTop: {
    position: 'absolute',
    top: 5,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 20,
    backgroundColor: '#22C55E',
    borderRadius: 15,
  },
  resultInfo: {
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#14532D',
    marginBottom: 6,
  },
  healthyBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  healthyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  veganTag: {
    backgroundColor: '#22C55E',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 10,
  },
  gfTag: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gfTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532D',
    textAlign: 'center',
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