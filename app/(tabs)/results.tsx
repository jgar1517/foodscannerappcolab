import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ResultsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Result Card */}
        <View style={styles.resultCard}>
          {/* Food Image and Info */}
          <View style={styles.foodHeader}>
            <View style={styles.broccoliContainer}>
              <View style={styles.broccoli}>
                <View style={styles.broccoliStem} />
                <View style={styles.broccoliTop} />
                <View style={[styles.broccoliFloret, styles.floret1]} />
                <View style={[styles.broccoliFloret, styles.floret2]} />
                <View style={[styles.broccoliFloret, styles.floret3]} />
              </View>
            </View>
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>Broccoli</Text>
              <View style={styles.healthyBadge}>
                <Text style={styles.healthyText}>Healthy</Text>
              </View>
            </View>
          </View>

          {/* Nutrition Facts */}
          <View style={styles.nutritionSection}>
            <Text style={styles.nutritionTitle}>Nutrition Facts</Text>
            <View style={styles.nutritionDivider} />
            
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>9 cal</Text>
            </View>
            
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Per Serving</Text>
              <Text style={styles.nutritionValue}>12%</Text>
            </View>
          </View>

          {/* Diet Tags */}
          <View style={styles.tagsSection}>
            <View style={styles.veganTag}>
              <View style={styles.leafIcon}>
                <Text style={styles.leafText}>🌿</Text>
              </View>
              <Text style={styles.tagText}>Vegan</Text>
            </View>
            
            <View style={styles.gfTag}>
              <Text style={styles.gfText}>GF</Text>
            </View>
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>
            Broccoli is a nutrient-dense vegetable that's high in vitamins C and K, 
            fiber, and antioxidants. It's naturally vegan and gluten-free.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15803D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#15803D',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: '#DCFCE7',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  broccoliContainer: {
    marginRight: 16,
  },
  broccoli: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  broccoliStem: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 30,
    backgroundColor: '#86EFAC',
    borderRadius: 8,
  },
  broccoliTop: {
    position: 'absolute',
    top: 10,
    left: '50%',
    marginLeft: -25,
    width: 50,
    height: 40,
    backgroundColor: '#22C55E',
    borderRadius: 25,
  },
  broccoliFloret: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#16A34A',
    borderRadius: 10,
  },
  floret1: {
    top: 5,
    left: 15,
  },
  floret2: {
    top: 5,
    right: 15,
  },
  floret3: {
    top: 20,
    left: '50%',
    marginLeft: -10,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#14532D',
    marginBottom: 8,
  },
  healthyBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  healthyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  nutritionSection: {
    marginBottom: 20,
  },
  nutritionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#14532D',
    marginBottom: 12,
  },
  nutritionDivider: {
    height: 2,
    backgroundColor: '#14532D',
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#14532D',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532D',
  },
  tagsSection: {
    flexDirection: 'row',
    gap: 12,
  },
  veganTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  leafIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#16A34A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafText: {
    fontSize: 12,
  },
  tagText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  gfTag: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gfText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  additionalInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#DCFCE7',
    lineHeight: 24,
    textAlign: 'center',
  },
});