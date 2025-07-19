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
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
              <View style={styles.preferencesContainer}>
                {userProfile.preferences.map((preference, index) => (
                  <View key={index} style={styles.preferenceChip}>
                    <Text style={styles.preferenceText}>{preference}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.scanCount}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Calendar size={20} color="#15803D" />
              <Text style={styles.statLabel}>Member Since</Text>
              <Text style={styles.statValue}>Mar 2024</Text>
            </View>
          </View>
        </View>

        {/* Goal Card */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Target size={24} color="#15803D" />
            <Text style={styles.sectionTitle}>Current Goal</Text>
          </View>
          <Text style={styles.goalText}>{userProfile.goal}</Text>
        </View>

        {/* Recent History Card */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <History size={24} color="#15803D" />
            <Text style={styles.sectionTitle}>Recent Scans</Text>
          </View>
          {userProfile.history.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyItemName}>{item.item}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
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
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#e5e7eb', true: '#15803D' }}
              thumbColor={'#ffffff'}
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
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#14532D',
  },
  userCard: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: '#ffffff',
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
    color: '#14532D',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceChip: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  preferenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },
  statsCard: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#ffffff',
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
    color: '#14532D',
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
    color: '#6b7280',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14532D',
    marginTop: 4,
  },
  goalCard: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#ffffff',
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
    color: '#6b7280',
    lineHeight: 24,
  },
  historyCard: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#ffffff',
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
    borderBottomColor: '#e5e7eb',
  },
  historyInfo: {
    flex: 1,
  },
  historyItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532D',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: '#6b7280',
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
    backgroundColor: '#ffffff',
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
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
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