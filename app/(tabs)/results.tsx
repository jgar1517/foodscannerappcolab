import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
        {/* Result Card */}
        <View style={styles.card}>
          {/* Broccoli Illustration */}
          <View style={styles.imageContainer}>
            <View style={styles.broccoli}>
              <View style={styles.broccoliStem} />
              <View style={styles.broccoliTop} />
              <View style={[styles.broccoliFloret, styles.floret1]} />
              <View style={[styles.broccoliFloret, styles.floret2]} />
              <View style={[styles.broccoliFloret, styles.floret3]} />
            </View>
          </View>
          
          {/* Title and Badge */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Broccoli</Text>
            <View style={styles.healthyBadge}>
              <Text style={styles.healthyText}>Healthy</Text>
            </View>
          </View>
          
          {/* Nutrition Facts */}
          <Text style={styles.label}>Nutrition Facts</Text>
          <View style={styles.divider} />
          <Text style={styles.fact}>Calories: 9 cal</Text>
          <Text style={styles.fact}>Per Serving: 12%</Text>
          
          {/* Tags */}
          <View style={styles.tags}>
            <View style={styles.chip}>
              <View style={styles.leafIcon}>
                <Text style={styles.leafText}>🌿</Text>
              </View>
              <Text style={styles.chipText}>Vegan</Text>
            </View>
            <View style={styles.gfChip}>
              <Text style={styles.gfText}>GF</Text>
            </View>
          </View>
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
  card: {
    backgroundColor: '#E6F4EA',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    margin: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  healthyBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  healthyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
    color: '#4CAF50',
    fontSize: 16,
  },
  divider: {
    height: 2,
    backgroundColor: '#4CAF50',
    marginVertical: 8,
  },
  fact: {
    fontSize: 16,
    marginVertical: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 6,
  },
  chip: {
    backgroundColor: '#A5D6A7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  leafIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafText: {
    fontSize: 10,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  gfChip: {
    backgroundColor: '#FFF59D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gfText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F57F17',
  },
});