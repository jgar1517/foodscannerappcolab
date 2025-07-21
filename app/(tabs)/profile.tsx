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
import { User, Bell, Moon, Shield, ChartBar as BarChart3, Eye, CircleHelp as HelpCircle, MessageSquare, Star, FileText, LogOut, ChevronRight, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import * as Haptics from 'expo-haptics';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import StaggeredList from '@/components/StaggeredList';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState('medium'); // 'small', 'medium', 'large'
  const [dietaryPreferences, setDietaryPreferences] = useState({
    glutenFree: true,
    vegan: false,
    diabeticFriendly: true,
    keto: false,
    paleo: false,
    lowSodium: true,
  });
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const userProfile = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop&crop=face",
    totalScans: 127,
    healthGoals: 8,
    streakDays: 85,
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const menuSections = [
    {
      title: "Dietary Preferences",
      items: [
        { icon: User, title: "Gluten-Free", subtitle: "Avoid gluten-containing ingredients", hasToggle: true, enabled: dietaryPreferences.glutenFree, key: 'glutenFree' },
        { icon: User, title: "Vegan", subtitle: "Plant-based diet preferences", hasToggle: true, enabled: dietaryPreferences.vegan, key: 'vegan' },
        { icon: User, title: "Diabetic-Friendly", subtitle: "Low sugar and carb options", hasToggle: true, enabled: dietaryPreferences.diabeticFriendly, key: 'diabeticFriendly' },
        { icon: User, title: "Keto", subtitle: "High fat, low carb diet", hasToggle: true, enabled: dietaryPreferences.keto, key: 'keto' },
        { icon: User, title: "Paleo", subtitle: "Whole foods diet", hasToggle: true, enabled: dietaryPreferences.paleo, key: 'paleo' },
        { icon: User, title: "Low Sodium", subtitle: "Reduced sodium intake", hasToggle: true, enabled: dietaryPreferences.lowSodium, key: 'lowSodium' },
      ]
    },
    {
      title: "Account",
      items: [
        { icon: User, title: "Edit Profile", subtitle: "Update your personal information" },
        { icon: User, title: "Font Size", subtitle: "Adjust text size for better readability", hasToggle: false, hasSelector: true, value: fontSize, key: 'fontSize' },
        { icon: Bell, title: "Notifications", subtitle: "Manage notification preferences", hasToggle: true, enabled: notifications, key: 'notifications' },
        { icon: Moon, title: "Dark Mode", subtitle: "Switch to dark theme", hasToggle: true, enabled: darkMode, key: 'darkMode' },
      ]
    },
    {
      title: "Health & Safety",
      items: [
        { icon: BarChart3, title: "Health Goals", subtitle: "Set and track health objectives" },
        { icon: Shield, title: "Safety Analytics", subtitle: "View your safety score trends" },
        { icon: Eye, title: "Data Privacy", subtitle: "Control your data and privacy settings" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, title: "Help Center", subtitle: "Get help and support" },
        { icon: MessageSquare, title: "Send Feedback", subtitle: "Help us improve the app" },
        { icon: Star, title: "Rate the App", subtitle: "Share your experience" },
      ]
    },
    {
      title: "Legal",
      items: [
        { icon: FileText, title: "Terms of Service", subtitle: "Read our terms and conditions" },
        { icon: FileText, title: "Privacy Policy", subtitle: "Learn about our privacy practices" },
      ]
    }
  ];

  const handleToggle = (sectionIndex: number, itemIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const item = menuSections[sectionIndex].items[itemIndex];
    
    if (item.key === 'darkMode') {
      setDarkMode(!darkMode);
    } else if (item.key === 'notifications') {
      setNotifications(!notifications);
    } else if (item.key === 'fontSize') {
      const sizes = ['small', 'medium', 'large'];
      const currentIndex = sizes.indexOf(fontSize);
      const nextIndex = (currentIndex + 1) % sizes.length;
      setFontSize(sizes[nextIndex]);
    } else if (item.key && item.key in dietaryPreferences) {
      setDietaryPreferences(prev => ({
        ...prev,
        [item.key]: !prev[item.key as keyof typeof prev]
      }));
    }
  };

  const handleMenuItemPress = async (item: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Handle navigation or action based on item
    console.log('Menu item pressed:', item.title);
  };

  const handleLogout = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle logout logic
    console.log('Logout pressed');
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
              <MaskedView
                style={{ flex: 1 }}
                maskElement={
                  <Text style={[styles.headerTitle, { backgroundColor: 'transparent' }]}>
                    Profile
                  </Text>
                }
              >
                <LinearGradient
                  colors={['#A78BFA', '#8B5CF6', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                >
                  <Text style={[styles.headerTitle, { opacity: 0 }]}>
                    Profile
                  </Text>
                </LinearGradient>
              </MaskedView>
              <Star size={20} color="#F59E0B" />
            </View>
          </View>

          {/* User Info Card */}
          <GlassmorphismCard
            style={[
              styles.userCard,
              {
                transform: [{ translateY: floatingTransform }],
              },
            ]}
          >
            <View style={styles.userCardContent}>
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.avatarGradient}
                  >
                    <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                  </LinearGradient>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{userProfile.name}</Text>
                  <Text style={styles.userEmail}>{userProfile.email}</Text>
                </View>
              </View>
              
              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.statBadge}
                  >
                    <AnimatedCounter 
                      value={userProfile.totalScans} 
                      style={styles.statNumber}
                      duration={1500}
                    />
                  </LinearGradient>
                  <Text style={styles.statLabel}>Total Scans</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.statBadge}
                  >
                    <AnimatedCounter 
                      value={userProfile.healthGoals} 
                      style={styles.statNumber}
                      duration={1500}
                    />
                  </LinearGradient>
                  <Text style={styles.statLabel}>Health Goals</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.statBadge}
                  >
                    <AnimatedCounter 
                      value={userProfile.streakDays} 
                      style={styles.statNumber}
                      duration={1500}
                    />
                  </LinearGradient>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
              </View>
            </View>
          </GlassmorphismCard>

          {/* Menu Sections */}
          <StaggeredList staggerDelay={150} initialDelay={300}>
            {menuSections.map((section, sectionIndex) => (
              <GlassmorphismCard
                key={sectionIndex}
                style={styles.menuSection}
                animated={false}
              >
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.items.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={itemIndex}
                      style={styles.menuItem}
                      onPress={() => item.hasToggle ? handleToggle(sectionIndex, itemIndex) : handleMenuItemPress(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemLeft}>
                        <LinearGradient
                          colors={['#3B82F6', '#1D4ED8']}
                          style={styles.menuIcon}
                        >
                          <item.icon size={20} color="#ffffff" />
                        </LinearGradient>
                        <View style={styles.menuItemText}>
                          <Text style={styles.menuItemTitle}>{item.title}</Text>
                          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                        </View>
                      </View>
                      <View style={styles.menuItemRight}>
                        {item.hasToggle ? (
                          <Switch
                            value={item.enabled}
                            onValueChange={() => handleToggle(sectionIndex, itemIndex)}
                            trackColor={{ false: 'rgba(255, 255, 255, 0.3)', true: '#14B8A6' }}
                            thumbColor={'#ffffff'}
                          />
                        ) : item.hasSelector ? (
                          <TouchableOpacity 
                            style={styles.fontSizeSelector}
                            onPress={() => handleToggle(sectionIndex, itemIndex)}
                          >
                            <Text style={styles.fontSizeText}>
                              {item.value?.charAt(0).toUpperCase() + item.value?.slice(1)}
                            </Text>
                            <ChevronRight size={16} color="#A78BFA" />
                          </TouchableOpacity>
                        ) : (
                          <ChevronRight size={20} color="#A78BFA" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </GlassmorphismCard>
            ))}
          </StaggeredList>

          {/* Logout Button */}
          <GlassmorphismCard
            style={[
              styles.logoutSection,
              {
                transform: [{ translateY: floatingTransform }],
              },
            ]}
          >
            <TouchableOpacity style={styles.logoutContent} onPress={handleLogout} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.logoutIcon}
                >
                  <LogOut size={20} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </GlassmorphismCard>

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
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: 0.5,
    textShadowColor: '#A78BFA',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  userCard: {
    marginHorizontal: 24,
    marginTop: 20,
  },
  userCardContent: {
    padding: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  userEmail: {
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
    letterSpacing: 0.2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#CBD5E1',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  menuSection: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  sectionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  menuItemSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    letterSpacing: 0.1,
  },
  menuItemRight: {
    marginLeft: 12,
  },
  logoutSection: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  logoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 40,
  },
  fontSizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  fontSizeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
});