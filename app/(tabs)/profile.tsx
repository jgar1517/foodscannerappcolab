import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Moon, Calendar, Target, History, Sparkles, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const userProfile = {
    "id": "user_001",
    "name": "Joseph Days",
    "email": "jdays@email.com",
    "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150&h=150&fit=crop&crop=face",
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
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setDarkMode(!darkMode);
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Sparkles size={24} color="#60A5FA" />
              <Text style={styles.headerTitle}>Profile</Text>
              <Star size={20} color="#F59E0B" />
            </View>
          </View>

          {/* User Info Card */}
          <Animated.View
            style={[
              styles.userCard,
              {
                transform: [{ translateY: floatingTransform }],
              },
            ]}
          >
            <BlurView intensity={30} style={styles.userCardBlur}>
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={['#3B82F6', '#1D4ED8']}
                    style={styles.avatarGradient}
                  >
                    <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                  </LinearGradient>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{userProfile.name}</Text>
                  <Text style={styles.userEmail}>{userProfile.email}</Text>
                  <View style={styles.preferencesContainer}>
                    {userProfile.preferences.map((preference, index) => (
                      <LinearGradient
                        key={index}
                        colors={['#8B5CF6', '#7C3AED']}
                        style={styles.preferenceChip}
                      >
                        <Text style={styles.preferenceText}>{preference}</Text>
                      </LinearGradient>
                    ))}
                  </View>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Stats Card */}
          <Animated.View
            style={[
              styles.statsCard,
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
            <BlurView intensity={30} style={styles.cardBlur}>
              <Text style={styles.sectionTitle}>Statistics</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.statNumberContainer}
                  >
                    <Text style={styles.statNumber}>{userProfile.scanCount}</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Total Scans</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Calendar size={24} color="#60A5FA" />
                  </View>
                  <Text style={styles.statLabel}>Member Since</Text>
                  <Text style={styles.statValue}>Mar 2024</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Goal Card */}
          <Animated.View
            style={[
              styles.goalCard,
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
              <View style={styles.goalHeader}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.goalIconContainer}
                >
                  <Target size={24} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Current Goal</Text>
              </View>
              <Text style={styles.goalText}>{userProfile.goal}</Text>
            </BlurView>
          </Animated.View>

          {/* Recent History Card */}
          <Animated.View
            style={[
              styles.historyCard,
              {
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -6],
                    }),
                  },
                ],
              },
            ]}
          >
            <BlurView intensity={30} style={styles.cardBlur}>
              <View style={styles.historyHeader}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.historyIconContainer}
                >
                  <History size={24} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Recent Scans</Text>
              </View>
              {userProfile.history.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyItemName}>{item.item}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <LinearGradient
                    colors={item.rating === 'Healthy' ? ['#22C55E', '#16A34A'] : ['#F59E0B', '#D97706']}
                    style={styles.ratingBadge}
                  >
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </LinearGradient>
                </View>
              ))}
            </BlurView>
          </Animated.View>

          {/* Theme Toggle Card */}
          <Animated.View
            style={[
              styles.themeCard,
              {
                transform: [{ scale: scaleAnim }, { translateY: floatingTransform }],
              },
            ]}
          >
            <BlurView intensity={30} style={styles.themeCardBlur}>
              <View style={styles.themeHeader}>
                <LinearGradient
                  colors={darkMode ? ['#1E293B', '#0F172A'] : ['#F59E0B', '#D97706']}
                  style={styles.themeIconContainer}
                >
                  {darkMode ? (
                    <Moon size={24} color="#60A5FA" />
                  ) : (
                    <Sun size={24} color="#ffffff" />
                  )}
                </LinearGradient>
                <Text style={styles.themeTitle}>Dark Mode</Text>
              </View>
              
              <View style={styles.toggleContainer}>
                <Switch 
                  value={darkMode} 
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.3)', true: '#3B82F6' }}
                  thumbColor={'#ffffff'}
                />
              </View>
            </BlurView>
          </Animated.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
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
  scrollView: {
    flex: 1,
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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  userCard: {
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userCardBlur: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 44,
    padding: 4,
  },
  avatarGradient: {
    borderRadius: 40,
    padding: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  userDetails: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#CBD5E1',
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
    color: '#ffffff',
  },
  statsCard: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBlur: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
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
  statNumberContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginTop: 4,
  },
  goalCard: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
  },
  historyCard: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyInfo: {
    flex: 1,
  },
  historyItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  themeCard: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  themeCardBlur: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  toggleContainer: {
    padding: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});