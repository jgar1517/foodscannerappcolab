import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Share2, MessageCircle, Mail, Copy, Download } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  scanData: {
    productName: string;
    safeCount: number;
    cautionCount: number;
    avoidCount: number;
    totalIngredients: number;
  };
}

export default function ShareModal({ visible, onClose, scanData }: ShareModalProps) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleShare = async (platform: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const shareText = `Just scanned ${scanData.productName} with Food Safety Scanner! 📱\n\n✅ Safe: ${scanData.safeCount}\n⚠️ Caution: ${scanData.cautionCount}\n❌ Avoid: ${scanData.avoidCount}\n\nMaking informed food choices has never been easier! #FoodSafety #HealthyEating`;

    // Simulate sharing (in real app, would use expo-sharing)
    console.log(`Sharing to ${platform}:`, shareText);
    
    // Show success feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const shareOptions = [
    { id: 'messages', icon: MessageCircle, label: 'Messages', color: ['#22C55E', '#16A34A'] },
    { id: 'email', icon: Mail, label: 'Email', color: ['#3B82F6', '#1D4ED8'] },
    { id: 'copy', icon: Copy, label: 'Copy Link', color: ['#14B8A6', '#0D9488'] },
    { id: 'save', icon: Download, label: 'Save Image', color: ['#F59E0B', '#D97706'] },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleContainer}>
                <Share2 size={24} color="#A78BFA" />
                <Text style={styles.headerTitle}>Share Results</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <X size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Scan Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.productName}>{scanData.productName}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.statBadge}
                  >
                    <Text style={styles.statNumber}>{scanData.safeCount}</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Safe</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.statBadge}
                  >
                    <Text style={styles.statNumber}>{scanData.cautionCount}</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Caution</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.statBadge}
                  >
                    <Text style={styles.statNumber}>{scanData.avoidCount}</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Avoid</Text>
                </View>
              </View>
            </View>

            {/* Share Options */}
            <View style={styles.shareOptions}>
              {shareOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.shareOption}
                  onPress={() => handleShare(option.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={option.color}
                    style={styles.shareIconContainer}
                  >
                    <option.icon size={24} color="#ffffff" />
                  </LinearGradient>
                  <Text style={styles.shareLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 4,
  },
  summaryContainer: {
    padding: 20,
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
    letterSpacing: 0.3,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  shareOption: {
    alignItems: 'center',
    gap: 8,
  },
  shareIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
    letterSpacing: 0.2,
  },
});