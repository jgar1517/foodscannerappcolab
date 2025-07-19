import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Moon, Calendar, Target, History } from 'lucide-react-native';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  
  const userProfile = {
    "id": "user_001",
    "name": "Joseph Days",
    "email": "jdays@email.com",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "preferences": ["Vegan", "Gluten-Free"],
    "scanCount": 14,
    "theme": "light",
    "joinedDate": "2024-03-15T10:20:00Z",
    "lastLogin": "2025-07-18T16:30:00Z",
    "goal": "Track sugar and calorie intake",
    "history": [
      { "item": "Broccoli", "date": "2025-07-16", "rating": "Healthy" },
      { "item": "Protein Bar", "date": "2025-07-14", "rating": "Moderate" }
    ],
    "settings": {
      "notifications": true,
      "language": "en"
    }
  };
  
  const toggleTheme = () => setDarkMode(!darkMode);

  // Dynamic styles based on dark mode
  const dynamicStyles = {
    container: {
      backgroundColor: darkMode ? '#1f2937' : '#f8f9fa',
    },
    card: {
      backgroundColor: darkMode ? '#374151' : '#ffffff',
    },
    text: {
      color: darkMode ? '#f9fafb' : '#14532D',
    },
    secondaryText: {
      color: darkMode ? '#d1d5db' : '#6b7280',
    },
    border: {
      borderColor: darkMode ? '#4b5563' : '#e5e7eb',
    },
    preferenceChip: {
      backgroundColor: darkMode ? '#065f46' : '#DCFCE7',
    },
    preferenceText: {
      color: darkMode ? '#a7f3d0' : '#15803D',
    },
    themeIcon: {
      backgroundColor: darkMode ? '#065f46' : '#DCFCE7',
    },
  };
  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, dynamicStyles.card, dynamicStyles.border]}>
          <Text style={[styles.headerTitle, dynamicStyles.text]}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={[styles.userCard, dynamicStyles.card]}>
          <View style={styles.userInfo}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            <View style={styles.userDetails}>
              <Text style={[styles.userName, dynamicStyles.text]}>{userProfile.name}</Text>
              <Text style={[styles.userEmail, dynamicStyles.secondaryText]}>{userProfile.email}</Text>
              <View style={styles.preferencesContainer}>
                {userProfile.preferences.map((preference, index) => (
                  <View key={index} style={[styles.preferenceChip, dynamicStyles.preferenceChip]}>
                    <Text style={[styles.preferenceText, dynamicStyles.preferenceText]}>{preference}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={[styles.statsCard, dynamicStyles.card]}>
          <Text style={[styles.sectionTitle, dynamicStyles.text]}>Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.scanCount}</Text>
              <Text style={[styles.statLabel, dynamicStyles.secondaryText]}>Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Calendar size={20} color="#15803D" />
              <Text style={[styles.statLabel, dynamicStyles.secondaryText]}>Member Since</Text>
              <Text style={[styles.statValue, dynamicStyles.text]}>Mar 2024</Text>
            </View>
          </View>
        </View>

        {/* Goal Card */}
        <View style={[styles.goalCard, dynamicStyles.card]}>
          <View style={styles.goalHeader}>
            <Target size={24} color="#15803D" />
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>Current Goal</Text>
          </View>
          <Text style={[styles.goalText, dynamicStyles.secondaryText]}>{userProfile.goal}</Text>
        </View>

        {/* Recent History Card */}
        <View style={[styles.historyCard, dynamicStyles.card]}>
          <View style={styles.historyHeader}>
            <History size={24} color="#15803D" />
            <Text style={[styles.sectionTitle, dynamicStyles.text]}>Recent Scans</Text>
          </View>
          {userProfile.history.map((item, index) => (
            <View key={index} style={[styles.historyItem, dynamicStyles.border]}>
              <View style={styles.historyInfo}>
                <Text style={[styles.historyItemName, dynamicStyles.text]}>{item.item}</Text>
                <Text style={[styles.historyDate, dynamicStyles.secondaryText]}>{item.date}</Text>
              </View>
              <View style={[
                styles.ratingBadge,
                item.rating === 'Healthy' ? styles.healthyBadge : styles.moderateBadge
              ]}>
                <Text style={[
                  styles.ratingText,
                  item.rating === 'Healthy' ? styles.healthyText : styles.moderateText
                ]}>{item.rating}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Theme Toggle Card */}
        <View style={[styles.themeCard, dynamicStyles.card]}>
          <View style={styles.themeHeader}>
            <View style={[styles.themeIconContainer, dynamicStyles.themeIcon]}>
              {darkMode ? (
                <Moon size={24} color={darkMode ? "#a7f3d0" : "#15803D"} />
              ) : (
                <Sun size={24} color={darkMode ? "#a7f3d0" : "#15803D"} />
              )}
            </View>
            <Text style={[styles.themeTitle, dynamicStyles.text]}>Dark Mode</Text>
          </View>
          
          <View style={styles.toggleContainer}>
            <Switch 
              value={darkMode} 
              onValueChange={toggleTheme}
              trackColor={{ false: darkMode ? '#4b5563' : '#e5e7eb', true: '#15803D' }}
              thumbColor={darkMode ? '#ffffff' : '#ffffff'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  userCard: {
    marginHorizontal: 24,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  preferenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsCard: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#15803D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  goalCard: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  goalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  historyCard: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyInfo: {
    flex: 1,
  },
  historyItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  healthyBadge: {
    backgroundColor: '#DCFCE7',
  },
  moderateBadge: {
    backgroundColor: '#FEF3C7',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  healthyText: {
    color: '#15803D',
  },
  moderateText: {
    color: '#D97706',
  },
  themeCard: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  toggleContainer: {
    padding: 4,
  },
});