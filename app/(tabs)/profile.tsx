import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Moon } from 'lucide-react-native';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleTheme = () => setDarkMode(!darkMode);

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
            <Switch 
              value={darkMode} 
              onValueChange={toggleTheme}
              trackColor={{ false: '#e5e7eb', true: '#15803D' }}
              thumbColor={darkMode ? '#ffffff' : '#ffffff'}
            />
          </View>
        </View>

        {/* Visual Style Guide Section */}
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
});