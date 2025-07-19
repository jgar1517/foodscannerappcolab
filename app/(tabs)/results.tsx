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
import { ArrowLeft, Sparkles, Star, Leaf, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import ShareModal from '@/components/ShareModal';
import SuccessAnimation from '@/components/SuccessAnimation';

const ingredientResults = [
  {
    name: "Tomato Puree",
    rating: "safe",
    explanation: "Natural tomato product with no safety concerns",
    confidence: 98
  },
  {
    name: "Water",
    rating: "safe", 
    explanation: "Essential for life and poses no safety concerns",
    confidence: 100
  },
  {
    name: "Salt",
    rating: "caution",
    explanation: "High sodium content may contribute to hypertension",
    confidence: 85
  },
  {
    name: "Citric Acid",
    rating: "safe",
    explanation: "Natural preservative, generally recognized as safe",
    confidence: 92
  },
  {
    name: "Natural Flavors",
    rating: "caution",
    explanation: "Vague term that may contain allergens or additives",
    confidence: 75
  },
  {
    name: "Calcium Chloride",
    rating: "avoid",
    explanation: "May cause digestive issues in sensitive individuals",
    confidence: 80
  }
];

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
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Show success animation when component mounts
    setShowSuccessAnimation(true);
    
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

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShareModalVisible(true);
  };

  const handleBackPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const safeCount = ingredientResults.filter(i => i.rating === 'safe').length;
  const cautionCount = ingredientResults.filter(i => i.rating === 'caution').length;
  const avoidCount = ingredientResults.filter(i => i.rating === 'avoid').length;

  const scanData = {
    productName: "H-E-B Tomato Sauce",
    safeCount,
    cautionCount,
    avoidCount,
    totalIngredients: ingredientResults.length,
  };
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
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="#F8FAFC" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Sparkles size={20} color="#60A5FA" />
            <Text style={styles.headerTitle}>Results</Text>
            <Star size={20} color="#F59E0B" />
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={24} color="#F8FAFC" />
          </TouchableOpacity>
        </BlurView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Product Info Card */}
          <Animated.View
            style={[
              styles.productCard,
              {
                transform: [{ scale: scaleAnim }, { translateY: floatingTransform }],
              },
            ]}
          >
            <BlurView intensity={30} style={styles.cardBlur}>
              {/* Tomato Sauce Illustration */}
              <View style={styles.imageContainer}>
                <Animated.View
                  style={[
                    styles.tomatoSauce,
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
                    colors={['#DC2626', '#B91C1C']}
                    style={styles.canBody}
                  />
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.canLabel}
                  />
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.canTop}
                  />
                </Animated.View>
              </View>
              
              {/* Title and Badge */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>H-E-B Tomato Sauce</Text>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.cautionBadge}
                >
                  <Text style={styles.badgeText}>Mixed</Text>
                </LinearGradient>
              </View>
              
              {/* Summary Stats */}
              <Text style={styles.label}>Safety Summary</Text>
              <LinearGradient
                colors={['#60A5FA', '#3B82F6']}
                style={styles.divider}
              />
              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.summaryBadge}
                  >
                    <Text style={styles.summaryCount}>{safeCount}</Text>
                  </LinearGradient>
                  <Text style={styles.summaryLabel}>Safe</Text>
                </View>
                <View style={styles.summaryItem}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.summaryBadge}
                  >
                    <Text style={styles.summaryCount}>{cautionCount}</Text>
                  </LinearGradient>
                  <Text style={styles.summaryLabel}>Caution</Text>
                </View>
                <View style={styles.summaryItem}>
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.summaryBadge}
                  >
                    <Text style={styles.summaryCount}>{avoidCount}</Text>
                  </LinearGradient>
                  <Text style={styles.summaryLabel}>Avoid</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Ingredients Analysis */}
          <Animated.View
            style={[
              styles.ingredientsCard,
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
            <BlurView intensity={30} style={styles.cardBlur}>
              <Text style={styles.sectionTitle}>Ingredient Analysis</Text>
              {ingredientResults.map((ingredient, index) => {
                const RatingIcon = getRatingIcon(ingredient.rating);
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.ingredientItem,
                      {
                        transform: [
                          {
                            translateY: floatAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -2 * index],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <View style={styles.ingredientHeader}>
                      <View style={styles.ingredientInfo}>
                        <Text style={styles.ingredientName}>{ingredient.name}</Text>
                        <Text style={styles.ingredientExplanation}>{ingredient.explanation}</Text>
                      </View>
                      <View style={styles.ratingContainer}>
                        <LinearGradient
                          colors={getRatingColor(ingredient.rating)}
                          style={styles.ratingBadge}
                        >
                          <RatingIcon size={16} color="#ffffff" />
                        </LinearGradient>
                        <Text style={styles.confidenceText}>{ingredient.confidence}%</Text>
                      </View>
                    </View>
                  </Animated.View>
                );
              })}
            </BlurView>
          </Animated.View>

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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  shareButton: {
    marginLeft: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  productCard: {
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
  tomatoSauce: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  canBody: {
    position: 'absolute',
    bottom: 5,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 60,
    borderRadius: 6,
  },
  canLabel: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -18,
    width: 36,
    height: 25,
    borderRadius: 4,
  },
  canTop: {
    position: 'absolute',
    top: 15,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 8,
    borderRadius: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
    letterSpacing: 0.3,
  },
  cautionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  badgeText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  label: {
    marginTop: 8,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#60A5FA',
    fontSize: 18,
    letterSpacing: 0.3,
  },
  divider: {
    height: 2,
    marginVertical: 8,
    borderRadius: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryCount: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#CBD5E1',
    letterSpacing: 0.3,
  },
  ingredientsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  ingredientItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientInfo: {
    flex: 1,
    marginRight: 12,
  },
  ingredientName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  ingredientExplanation: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 40,
  },
});