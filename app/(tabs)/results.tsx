import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Circle as XCircle } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import ShareModal from '@/components/ShareModal';
import SuccessAnimation from '@/components/SuccessAnimation';

const ingredientResults = [
  {
    name: "Water",
    rating: "safe",
    explanation: "Water is essential for life and poses no safety concerns.",
    confidence: 100,
    position: 1,
    sources: ["FDA", "EWG"]
  },
  {
    name: "Organic Cane Sugar",
    rating: "caution", 
    explanation: "High sugar content may contribute to weight gain and dental issues. Moderate consumption recommended.",
    confidence: 85,
    position: 2,
    sources: ["EWG", "WHO"]
  },
  {
    name: "Natural Flavors",
    rating: "caution",
    explanation: "While generally safe, \"natural flavors\" can be vague and may contain allergens or chemicals not listed.",
    confidence: 70,
    position: 3,
    sources: ["FDA"]
  },
  {
    name: "Cocoa Powder",
    rating: "safe",
    explanation: "Natural cocoa powder provides antioxidants and is generally safe for consumption.",
    confidence: 98,
    position: 4,
    sources: ["FDA", "EWG"]
  },
  {
    name: "Soybean Oil",
    rating: "safe",
    explanation: "Commonly used cooking oil that is generally recognized as safe by regulatory authorities.",
    confidence: 88,
    position: 5,
    sources: ["FDA"]
  },
  {
    name: "Palm Oil",
    rating: "caution",
    explanation: "High in saturated fat which may raise cholesterol levels. Environmental concerns with production methods.",
    confidence: 88,
    position: 6,
    sources: ["EWG"]
  },
  {
    name: "High Fructose Corn Syrup",
    rating: "caution",
    explanation: "Linked to obesity, diabetes, and metabolic issues when consumed in large quantities over time.",
    confidence: 89,
    position: 7,
    sources: ["EWG", "WHO"]
  },
  {
    name: "Yellow 5 (Tartrazine)",
    rating: "avoid",
    explanation: "Artificial food coloring linked to hyperactivity in children and may cause allergic reactions in sensitive individuals.",
    confidence: 91,
    position: 8,
    sources: ["EWG"]
  }
];

const getRatingColor = (rating: string) => {
  switch (rating) {
    case 'safe':
      return '#22C55E';
    case 'caution':
      return '#F59E0B';
    case 'avoid':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const getRatingIcon = (rating: string) => {
  switch (rating) {
    case 'safe':
      return CheckCircle;
    case 'caution':
      return AlertTriangle;
    case 'avoid':
      return XCircle;
    default:
      return CheckCircle;
  }
};

export default function ResultsScreen() {
  const router = useRouter();
  const { fromScan } = useLocalSearchParams();
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(!!fromScan);
  const [activeTab, setActiveTab] = useState('ingredients');
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShareModalVisible(true);
  };

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const safeCount = ingredientResults.filter(i => i.rating === 'safe').length;
  const cautionCount = ingredientResults.filter(i => i.rating === 'caution').length;
  const avoidCount = ingredientResults.filter(i => i.rating === 'avoid').length;

  const scanData = {
    productName: "Chocolate Cookies",
    safeCount,
    cautionCount,
    avoidCount,
    totalIngredients: ingredientResults.length,
  };

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
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header with back button and share */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="#F8FAFC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={24} color="#60A5FA" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Product Header */}
          <GlassmorphismCard style={styles.productHeaderCard}>
            <View style={styles.productHeader}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?w=80&h=80&fit=crop' }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>Scan Results</Text>
                <Text style={styles.productSubtitle}>8 ingredients analyzed in 4.2s</Text>
              </View>
            </View>
          </GlassmorphismCard>

          {/* Safety Score Circle */}
          <GlassmorphismCard style={styles.scoreCard}>
            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>72</Text>
                <Text style={styles.scoreLabel}>Safety Score</Text>
              </View>
            </View>
          </GlassmorphismCard>

          {/* Summary Stats */}
          <GlassmorphismCard style={styles.summaryCard}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                  <CheckCircle size={30} color="#22C55E" />
                </View>
                <Text style={styles.summaryLabel}>Safe</Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                  <AlertTriangle size={30} color="#F59E0B" />
                </View>
                <Text style={styles.summaryLabel}>Caution</Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                  <XCircle size={30} color="#EF4444" />
                </View>
                <Text style={styles.summaryLabel}>Avoid</Text>
              </View>
            </View>
          </GlassmorphismCard>

          {/* Tab Navigation */}
          <GlassmorphismCard style={styles.tabCard}>
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
                onPress={() => setActiveTab('ingredients')}
              >
                <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
                  Ingredients
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'alternatives' && styles.activeTab]}
                onPress={() => setActiveTab('alternatives')}
              >
                <Text style={[styles.tabText, activeTab === 'alternatives' && styles.activeTabText]}>
                  Alternatives
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
                onPress={() => setActiveTab('recipes')}
              >
                <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
                  Recipes
                </Text>
              </TouchableOpacity>
            </View>
          </GlassmorphismCard>

          {activeTab === 'ingredients' && (
            <View style={styles.ingredientsContainer}>
              {ingredientResults.map((ingredient, index) => {
                const RatingIcon = getRatingIcon(ingredient.rating);
                return (
                  <GlassmorphismCard key={index} style={styles.ingredientCard}>
                    <View style={styles.ingredientContent}>
                      <View style={styles.ingredientHeader}>
                        <View style={styles.ingredientInfo}>
                          <Text style={styles.ingredientName}>{ingredient.name}</Text>
                          <Text style={styles.ingredientMeta}>
                            Position #{ingredient.position} • {ingredient.confidence}% confidence
                          </Text>
                        </View>
                        <View style={styles.ratingBadge}>
                          <View style={[styles.ratingIconContainer, { backgroundColor: `${getRatingColor(ingredient.rating)}20` }]}>
                            <RatingIcon size={16} color={getRatingColor(ingredient.rating)} />
                          </View>
                          <Text style={[styles.ratingText, { color: getRatingColor(ingredient.rating) }]}>
                            {ingredient.rating.charAt(0).toUpperCase() + ingredient.rating.slice(1)}
                          </Text>
                        </View>
                      </View>
                      
                      <Text style={styles.ingredientExplanation}>{ingredient.explanation}</Text>
                      
                      <View style={styles.sourcesContainer}>
                        <Text style={styles.sourcesLabel}>Sources:</Text>
                        {ingredient.sources.map((source, idx) => (
                          <View key={idx} style={styles.sourceTag}>
                            <Text style={styles.sourceText}>{source}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </GlassmorphismCard>
                );
              })}
            </View>
          )}

          {activeTab === 'alternatives' && (
            <GlassmorphismCard style={styles.placeholderCard}>
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>Alternative products coming soon...</Text>
              </View>
            </GlassmorphismCard>
          )}

          {activeTab === 'recipes' && (
            <GlassmorphismCard style={styles.placeholderCard}>
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>Recipe suggestions coming soon...</Text>
              </View>
            </GlassmorphismCard>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
        
        {/* Share Modal */}
        <ShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          scanData={scanData}
        />
        
        {/* Success Animation */}
        <SuccessAnimation
          visible={showSuccessAnimation}
          onComplete={() => setShowSuccessAnimation(false)}
        />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(42, 26, 62, 0.9)',
  },
  backButton: {
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  productHeaderCard: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  productHeader: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
  },
  scoreCard: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  scoreNumber: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#6B7280',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryCount: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
  },
  tabCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row', 
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#14B8A6',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
  },
  activeTabText: {
    color: '#60A5FA',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  ingredientsContainer: {
    padding: 20,
  },
  ingredientCard: {
    marginBottom: 16,
  },
  ingredientContent: {
    padding: 20,
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ingredientInfo: {
    flex: 1,
    marginRight: 12,
  },
  ingredientName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  ingredientMeta: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  ingredientExplanation: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    lineHeight: 24,
    marginBottom: 16,
  },
  sourcesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  sourcesLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
  },
  sourceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sourceText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#F8FAFC',
  },
  placeholderCard: {
    marginHorizontal: 20,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
  },
  bottomSpacing: {
    height: 40,
  },
  alternativesContainer: {
    padding: 20,
  },
  alternativesTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  alternativeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
  },
  alternativeImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  alternativeName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  alternativeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingIcon: {
    fontSize: 16,
  },
  ratingScore: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#F59E0B',
  },
  alternativeBrand: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  alternativeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  alternativeReason: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#22C55E',
    lineHeight: 18,
  },
});