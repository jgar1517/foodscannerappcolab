import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Shield, AlertTriangle, X, RefreshCw } from 'lucide-react-native';
import { GlassmorphismCard } from '../../components/GlassmorphismCard';
import { CircularProgress } from '../../components/CircularProgress';
import type { OCRResult, ProcessedIngredient } from '../../hooks/useOCR';

const { width } = Dimensions.get('window');

// Mock data for fallback
const mockResults: OCRResult = {
  extractedText: "Water, Organic Cane Sugar, Natural Flavors, Citric Acid, Sodium Benzoate (Preservative), Ascorbic Acid (Vitamin C)",
  ingredients: [
    {
      name: "Water",
      safetyRating: "safe",
      confidence: 95,
      explanation: "Pure water is completely safe and essential for hydration.",
      allergens: [],
      concerns: []
    },
    {
      name: "Organic Cane Sugar",
      safetyRating: "caution",
      confidence: 88,
      explanation: "Natural sweetener, but high consumption may contribute to health issues.",
      allergens: [],
      concerns: ["High caloric content", "May affect blood sugar"]
    },
    {
      name: "Natural Flavors",
      safetyRating: "caution",
      confidence: 75,
      explanation: "Generally safe but can be vague term covering many compounds.",
      allergens: [],
      concerns: ["Undefined ingredients", "Potential allergens"]
    },
    {
      name: "Citric Acid",
      safetyRating: "safe",
      confidence: 92,
      explanation: "Natural preservative and flavor enhancer, generally recognized as safe.",
      allergens: [],
      concerns: []
    },
    {
      name: "Sodium Benzoate",
      safetyRating: "avoid",
      confidence: 85,
      explanation: "Preservative that may form benzene when combined with vitamin C.",
      allergens: [],
      concerns: ["Potential carcinogen formation", "May cause hyperactivity in children"]
    },
    {
      name: "Ascorbic Acid (Vitamin C)",
      safetyRating: "safe",
      confidence: 98,
      explanation: "Essential vitamin and antioxidant, beneficial for health.",
      allergens: [],
      concerns: []
    }
  ],
  confidence: 87,
  processingTime: 2340
};

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const [results, setResults] = useState<OCRResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to parse OCR data from params
    if (params.ocrData && typeof params.ocrData === 'string') {
      try {
        const parsedData = JSON.parse(params.ocrData);
        if (validateOCRResult(parsedData)) {
          setResults(parsedData);
        } else {
          // Fall back to mock data if parsed data is invalid
          setResults(mockResults);
        }
      } catch (error) {
        console.error('Error parsing OCR data:', error);
        setResults(mockResults);
      }
    } else {
      // Use mock data if no params
      setResults(mockResults);
    }
    
    setIsLoading(false);
  }, [params.ocrData]);

  const validateOCRResult = (data: any): data is OCRResult => {
    return (
      data &&
      typeof data.extractedText === 'string' &&
      Array.isArray(data.ingredients) &&
      data.ingredients.length > 0 &&
      typeof data.confidence === 'number' &&
      typeof data.processingTime === 'number'
    );
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'safe': return '#10B981';
      case 'caution': return '#F59E0B';
      case 'avoid': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSafetyIcon = (rating: string) => {
    switch (rating) {
      case 'safe': return <Shield size={20} color="#10B981" />;
      case 'caution': return <AlertTriangle size={20} color="#F59E0B" />;
      case 'avoid': return <X size={20} color="#EF4444" />;
      default: return <Shield size={20} color="#6B7280" />;
    }
  };

  const getOverallRating = () => {
    if (!results?.ingredients.length) return { rating: 'unknown', score: 0 };
    
    const ratings = results.ingredients.map(ing => {
      switch (ing.safetyRating) {
        case 'safe': return 100;
        case 'caution': return 60;
        case 'avoid': return 20;
        default: return 50;
      }
    });
    
    const avgScore = ratings.reduce((sum, score) => sum + score, 0) / ratings.length;
    
    if (avgScore >= 80) return { rating: 'safe', score: Math.round(avgScore) };
    if (avgScore >= 60) return { rating: 'caution', score: Math.round(avgScore) };
    return { rating: 'avoid', score: Math.round(avgScore) };
  };

  const handleRetry = () => {
    router.push('/(tabs)/scan');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <RefreshCw size={48} color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </View>
    );
  }

  if (!results || !results.ingredients.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Results</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <AlertTriangle size={64} color="#F59E0B" />
          <Text style={styles.emptyTitle}>No Ingredients Found</Text>
          <Text style={styles.emptyMessage}>
            We couldn't identify any ingredients from your scan. Please try again with better lighting and ensure the ingredient list is clearly visible.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <RefreshCw size={20} color="#FFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const overallRating = getOverallRating();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Results</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Score */}
        <GlassmorphismCard style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Overall Safety Score</Text>
            <Text style={styles.processingTime}>
              Processed in {results.processingTime || 0}ms
            </Text>
          </View>
          
          <View style={styles.scoreContent}>
            <CircularProgress
              size={120}
              progress={overallRating.score}
              color={getSafetyColor(overallRating.rating)}
              strokeWidth={8}
            />
            <View style={styles.scoreDetails}>
              <Text style={[styles.scoreValue, { color: getSafetyColor(overallRating.rating) }]}>
                {overallRating.score}/100
              </Text>
              <Text style={styles.scoreLabel}>
                {overallRating.rating.charAt(0).toUpperCase() + overallRating.rating.slice(1)}
              </Text>
            </View>
          </View>
        </GlassmorphismCard>

        {/* Ingredients List */}
        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>
            Ingredients Analysis ({results.ingredients.length} found)
          </Text>
          
          {results.ingredients.map((ingredient, index) => (
            <GlassmorphismCard key={index} style={styles.ingredientCard}>
              <View style={styles.ingredientHeader}>
                <View style={styles.ingredientTitleRow}>
                  {getSafetyIcon(ingredient.safetyRating)}
                  <Text style={styles.ingredientName}>
                    {ingredient.name || 'Unknown Ingredient'}
                  </Text>
                </View>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceText}>
                    {ingredient.confidence || 0}% confident
                  </Text>
                </View>
              </View>
              
              <Text style={styles.ingredientExplanation}>
                {ingredient.explanation || 'No explanation available'}
              </Text>
              
              {ingredient.concerns && ingredient.concerns.length > 0 && (
                <View style={styles.concernsContainer}>
                  <Text style={styles.concernsTitle}>Concerns:</Text>
                  {ingredient.concerns.map((concern, idx) => (
                    <Text key={idx} style={styles.concernText}>
                      • {concern}
                    </Text>
                  ))}
                </View>
              )}
              
              {ingredient.allergens && ingredient.allergens.length > 0 && (
                <View style={styles.allergensContainer}>
                  <Text style={styles.allergensTitle}>Allergens:</Text>
                  <View style={styles.allergenTags}>
                    {ingredient.allergens.map((allergen, idx) => (
                      <View key={idx} style={styles.allergenTag}>
                        <Text style={styles.allergenText}>{allergen}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </GlassmorphismCard>
          ))}
        </View>

        {/* Extracted Text */}
        {results.extractedText && (
          <GlassmorphismCard style={styles.extractedTextCard}>
            <Text style={styles.sectionTitle}>Extracted Text</Text>
            <Text style={styles.extractedText}>
              {results.extractedText}
            </Text>
          </GlassmorphismCard>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.scanAgainButton} onPress={handleRetry}>
            <RefreshCw size={20} color="#FFF" />
            <Text style={styles.scanAgainText}>Scan Another Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: 'Poppins-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  scoreCard: {
    marginTop: 16,
    marginBottom: 24,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-Bold',
  },
  processingTime: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Poppins-ExtraBold',
  },
  scoreLabel: {
    fontSize: 18,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
  },
  ingredientsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  ingredientCard: {
    marginBottom: 16,
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ingredientTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  confidenceContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontFamily: 'Inter-Medium',
  },
  ingredientExplanation: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  concernsContainer: {
    marginTop: 8,
  },
  concernsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  concernText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  allergensContainer: {
    marginTop: 8,
  },
  allergensTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  allergenTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  allergenTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  allergenText: {
    fontSize: 12,
    color: '#F59E0B',
    fontFamily: 'Inter-Medium',
  },
  extractedTextCard: {
    marginBottom: 24,
  },
  extractedText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionButtons: {
    paddingBottom: 32,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanAgainText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});