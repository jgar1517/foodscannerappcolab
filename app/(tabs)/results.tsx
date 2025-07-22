import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Share2, 
  Sparkles,
  Info,
  Clock
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import CircularProgress from '@/components/CircularProgress';
import ShareModal from '@/components/ShareModal';
import StaggeredList from '@/components/StaggeredList';

interface IngredientResult {
  name: string;
  rating: 'safe' | 'caution' | 'avoid';
  explanation: string;
  confidence: number;
  position: number;
  sources: string[];
}

interface ScanData {
  ingredients: IngredientResult[];
  confidence: number;
  rawText: string;
}

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (params.fromScan === 'true' && params.scanData) {
      try {
        const parsedData = JSON.parse(params.scanData as string);
        setScanData(parsedData);
      } catch (error) {
        console.error('Error parsing scan data:', error);
        // Fall back to sample data
        setScanData(getSampleData());
      }
    } else {
      // Show sample data when not from scan
      setScanData(getSampleData());
    }
  }, [params]);

  const getSampleData = (): ScanData => ({
    ingredients: [
      {
        name: "Water",
        rating: "safe",
        explanation: "Water is essential for life and poses no safety concerns.",
        confidence: 100,
        position: 1,
        sources: ["FDA", "EWG"]
      },
      {
        name: "Sugar",
        rating: "caution",
        explanation: "High sugar content may contribute to weight gain and dental issues. Moderate consumption recommended.",
        confidence: 85,
        position: 2,
        sources: ["EWG", "WHO"]
      },
      {
        name: "High Fructose Corn Syrup",
        rating: "avoid",
        explanation: "Linked to obesity, diabetes, and metabolic issues when consumed in large quantities over time.",
        confidence: 89,
        position: 3,
        sources: ["EWG", "WHO"]
      },
      {
        name: "Natural Flavors",
        rating: "caution",
        explanation: "While generally safe, 'natural flavors' can be vague and may contain allergens or chemicals not listed.",
        confidence: 70,
        position: 4,
        sources: ["FDA"]
      },
      {
        name: "Citric Acid",
        rating: "safe",
        explanation: "Natural preservative derived from citrus fruits, generally safe for consumption.",
        confidence: 95,
        position: 5,
        sources: ["FDA", "EWG"]
      }
    ],
    confidence: 87,
    rawText: "Ingredients: Water, Sugar, High Fructose Corn Syrup, Natural Flavors, Citric Acid"
  });

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShareModalVisible(true);
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'safe':
        return <CheckCircle size={20} color="#22C55E" />;
      case 'caution':
        return <AlertTriangle size={20} color="#F59E0B" />;
      case 'avoid':
        return <XCircle size={20} color="#EF4444" />;
      default:
        return <Info size={20} color="#6B7280" />;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'safe':
        return ['#22C55E', '#16A34A'];
      case 'caution':
        return ['#F59E0B', '#D97706'];
      case 'avoid':
        return ['#EF4444', '#DC2626'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  if (!scanData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading results...</Text>
      </View>
    );
  }

  const safeCount = scanData.ingredients.filter(ing => ing.rating === 'safe').length;
  const cautionCount = scanData.ingredients.filter(ing => ing.rating === 'caution').length;
  const avoidCount = scanData.ingredients.filter(ing => ing.rating === 'avoid').length;

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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Search size={24} color="#60A5FA" />
              <MaskedView
                style={{ flex: 1 }}
                maskElement={
                  <Text style={[styles.headerTitle, { backgroundColor: 'transparent' }]}>
                    Scan Results
                  </Text>
                }
              >
                <LinearGradient
                  colors={['#A78BFA', '#8B5CF6', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                >
                  <Text style={[styles.headerTitle, { opacity: 0 }]}>
                    Scan Results
                  </Text>
                </LinearGradient>
              </MaskedView>
              <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                <Share2 size={20} color="#A78BFA" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary Card */}
          <GlassmorphismCard
            style={[
              styles.summaryCard,
              {
                transform: [{ translateY: floatingTransform }],
              },
            ]}
          >
            <View style={styles.summaryContent}>
              <View style={styles.summaryHeader}>
                <CircularProgress
                  size={80}
                  strokeWidth={8}
                  progress={scanData.confidence}
                  color={['#8B5CF6', '#7C3AED']}
                />
                <View style={styles.summaryText}>
                  <Text style={styles.summaryTitle}>Analysis Complete</Text>
                  <Text style={styles.summarySubtitle}>
                    {scanData.ingredients.length} ingredients analyzed
                  </Text>
                  {params.fromScan === 'true' && (
                    <View style={styles.freshScanBadge}>
                      <Clock size={12} color="#22C55E" />
                      <Text style={styles.freshScanText}>Fresh Scan</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.statBadge}
                  >
                    <Text style={styles.statNumber}>{safeCount}</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Safe</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.statBadge}
                  >
                    <Text style={styles.statNumber}>{cautionCount}</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Caution</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.statBadge}
                  >
                    <Text style={styles.statNumber}>{avoidCount}</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Avoid</Text>
                </View>
              </View>
            </View>
          </GlassmorphismCard>

          {/* Ingredients List */}
          <GlassmorphismCard
            style={[
              styles.ingredientsCard,
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
            <View style={styles.ingredientsContent}>
              <View style={styles.ingredientsHeader}>
                <Sparkles size={20} color="#A78BFA" />
                <Text style={styles.ingredientsTitle}>Ingredient Analysis</Text>
              </View>

              <StaggeredList staggerDelay={100} initialDelay={200}>
                {scanData.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <View style={styles.ingredientHeader}>
                      <View style={styles.ingredientTitleRow}>
                        {getRatingIcon(ingredient.rating)}
                        <Text style={styles.ingredientName}>{ingredient.name}</Text>
                        <View style={styles.confidenceBadge}>
                          <Text style={styles.confidenceText}>{ingredient.confidence}%</Text>
                        </View>
                      </View>
                      <LinearGradient
                        colors={getRatingColor(ingredient.rating)}
                        style={styles.ratingBadge}
                      >
                        <Text style={styles.ratingText}>
                          {ingredient.rating.toUpperCase()}
                        </Text>
                      </LinearGradient>
                    </View>
                    <Text style={styles.ingredientExplanation}>
                      {ingredient.explanation}
                    </Text>
                    <View style={styles.sourcesContainer}>
                      <Text style={styles.sourcesLabel}>Sources: </Text>
                      <Text style={styles.sourcesText}>
                        {ingredient.sources.join(', ')}
                      </Text>
                    </View>
                  </View>
                ))}
              </StaggeredList>
            </View>
          </GlassmorphismCard>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>

      {/* Share Modal */}
      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        scanData={{
          productName: "Scanned Product",
          safeCount,
          cautionCount,
          avoidCount,
          totalIngredients: scanData.ingredients.length,
        }}
      />
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A1A3E',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: 0.5,
    textShadowColor: '#A78BFA',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    textAlign: 'center',
    flex: 1,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
  },
  summaryCard: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  summaryContent: {
    padding: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  summarySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
    letterSpacing: 0.2,
  },
  freshScanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  freshScanText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#22C55E',
    letterSpacing: 0.2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
    letterSpacing: 0.3,
  },
  ingredientsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  ingredientsContent: {
    padding: 20,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  ingredientItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ingredientTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  ingredientName: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    color: '#F8FAFC',
    flex: 1,
    letterSpacing: 0.2,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
    letterSpacing: 0.2,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  ingredientExplanation: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    lineHeight: 22,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  sourcesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourcesLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  sourcesText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    letterSpacing: 0.1,
  },
  bottomSpacing: {
    height: 40,
  },
});