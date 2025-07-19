import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Heart, Shield, Star, FileText, CircleHelp as HelpCircle, LogOut, ChevronRight, Crown, Zap, Calendar, ChartBar as BarChart3, Sun, Moon } from 'lucide-react-native';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Appearance</Text>
        </View>

        {/* Theme Toggle Card */}
        <View style={styles.themeCard}>
          <View style={styles.themeHeader}>
            <View style={styles.themeIconContainer}>
              {darkMode ? (
                <Moon size={24} color="#15803D" />
              ) : (
                <Sun size={24} color="#15803D" />
              )}
            </View>
            <Text style={styles.themeTitle}>Dark Mode</Text>
          </View>
          
          <View style={styles.toggleContainer}>
            <View style={[styles.toggle, darkMode && styles.toggleActive]}>
              <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]} />
            </View>
          </View>
        </View>

        {/* Visual Style Guide Section */}
        <View style={styles.styleGuideSection}>
          <Text style={styles.sectionTitle}>Food Scanner App - Visual Style Guide</Text>
          
          {/* Color Palette */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Color Palette</Text>
            <View style={styles.colorGrid}>
              <View style={styles.colorRow}>
                <View style={[styles.colorSwatch, { backgroundColor: '#14532D' }]} />
                <View style={[styles.colorSwatch, { backgroundColor: '#15803D' }]} />
                <View style={[styles.colorSwatch, { backgroundColor: '#22C55E' }]} />
                <View style={[styles.colorSwatch, { backgroundColor: '#4ADE80' }]} />
              </View>
              <View style={styles.colorRow}>
                <View style={[styles.colorSwatch, { backgroundColor: '#86EFAC' }]} />
                <View style={[styles.colorSwatch, { backgroundColor: '#BBF7D0' }]} />
                <View style={[styles.colorSwatch, { backgroundColor: '#DCFCE7' }]} />
                <View style={[styles.colorSwatch, { backgroundColor: '#f8f9fa' }]} />
              </View>
            </View>
          </View>

          {/* Typography */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Typography</Text>
            <View style={styles.typographyExamples}>
              <View style={styles.buttonExample}>
                <Text style={styles.buttonText}>SCAN FOOD</Text>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Text style={styles.cameraButtonText}>📷</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Components */}
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Components</Text>
            <View style={styles.componentsRow}>
              {/* Scan Component */}
              <View style={styles.componentExample}>
                <View style={styles.scanComponentCard}>
                  <View style={styles.scanFrame}>
                    <View style={styles.appleIcon}>
                      <View style={styles.appleBody} />
                      <View style={styles.appleLeaf} />
                    </View>
                  </View>
                  <Text style={styles.scanLabel}>SCAN FOOD</Text>
                </View>
                <Text style={styles.componentLabel}>Theme exmust</Text>
              </View>

              {/* Result Component */}
              <View style={styles.componentExample}>
                <View style={styles.resultComponentCard}>
                  <View style={styles.broccoliContainer}>
                    <View style={styles.broccoli}>
                      <View style={styles.broccoliStem} />
                      <View style={styles.broccoliTop} />
                    </View>
                    <View style={styles.resultInfo}>
                      <Text style={styles.broccoliText}>Broccoli</Text>
                      <View style={styles.healthyBadge}>
                        <Text style={styles.healthyText}>Healthy</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.tags}>
                    <View style={styles.veganTag}>
                      <Text style={styles.leafEmoji}>🌿</Text>
                    </View>
                    <View style={styles.gfTag}>
                      <Text style={styles.gfText}>GF</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.componentLabel}>Theme switch</Text>
              </View>
            </View>
          </View>

          {/* Export Section */}
          <View style={styles.exportSection}>
            <Text style={styles.exportTitle}>Export visual style guide</Text>
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportButtonText}>Export Guide</Text>
            </TouchableOpacity>
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
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#14532D',
  },
  themeCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14532D',
  },
  toggleContainer: {
    padding: 4,
  },
  toggle: {
    width: 60,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleActive: {
    backgroundColor: '#15803D',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 28 }],
  },
  styleGuideSection: {
    backgroundColor: '#ffffff',
    margin: 24,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#14532D',
    marginBottom: 24,
  },
  subsection: {
    marginBottom: 32,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14532D',
    marginBottom: 16,
  },
  colorGrid: {
    gap: 12,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  cameraButton: {
    backgroundColor: '#15803D',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 20,
  },
  componentsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  componentExample: {
    flex: 1,
    alignItems: 'center',
  },
  scanComponentCard: {
    backgroundColor: '#15803D',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  scanFrame: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appleIcon: {
    position: 'relative',
    width: 30,
    height: 30,
  },
  appleBody: {
    width: 30,
    height: 26,
    backgroundColor: '#ef4444',
    borderRadius: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  appleLeaf: {
    position: 'absolute',
    top: -2,
    right: 9,
    width: 10,
    height: 6,
    backgroundColor: '#22C55E',
    borderRadius: 5,
    transform: [{ rotate: '45deg' }],
  },
  scanLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  resultComponentCard: {
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    width: '100%',
  },
  broccoliContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  broccoli: {
    width: 30,
    height: 30,
    position: 'relative',
    marginRight: 8,
  },
  broccoliStem: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 12,
    backgroundColor: '#86EFAC',
    borderRadius: 3,
  },
  broccoliTop: {
    position: 'absolute',
    top: 3,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 15,
    backgroundColor: '#22C55E',
    borderRadius: 10,
  },
  resultInfo: {
    flex: 1,
  },
  broccoliText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14532D',
    marginBottom: 4,
  },
  healthyBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  healthyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  veganTag: {
    backgroundColor: '#22C55E',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafEmoji: {
    fontSize: 12,
  },
  gfTag: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gfText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  componentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14532D',
    textAlign: 'center',
  },
  exportSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14532D',
    marginBottom: 16,
  },
  exportButton: {
    backgroundColor: '#15803D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});