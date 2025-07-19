import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ArrowLeft, Sparkles, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const scanLineAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Pulse animation for capture button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scan line animation
    Animated.loop(
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F172A', '#1E293B', '#334155']}
          style={styles.backgroundGradient}
        />
        <Text style={styles.message}>Camera permissions are loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F172A', '#1E293B', '#334155']}
          style={styles.backgroundGradient}
        />
        <SafeAreaView style={styles.permissionContainer}>
          <BlurView intensity={30} style={styles.permissionBlur}>
            <Animated.View
              style={[
                styles.permissionContent,
                {
                  transform: [
                    {
                      translateY: floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -10],
                      }),
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.permissionIconContainer}
              >
                <Camera size={40} color="#ffffff" />
              </LinearGradient>
              <Text style={styles.permissionTitle}>Camera Access Required</Text>
              <Text style={styles.permissionMessage}>
                We need access to your camera to scan food items and provide nutritional analysis.
              </Text>
              <TouchableOpacity 
                style={styles.permissionButton}
                onPress={requestPermission}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.permissionButtonGradient}
                >
                  <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </BlurView>
        </SafeAreaView>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          setCapturedImage(photo.uri);
          setIsProcessing(true);
          // Simulate processing and navigate to results
          setTimeout(() => {
            setIsProcessing(false);
            router.push('/results');
          }, 2000);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const scanLineTransform = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <BlurView intensity={20} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#F8FAFC" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Sparkles size={20} color="#60A5FA" />
            <Text style={styles.headerTitle}>Scan Food</Text>
            <Zap size={20} color="#F59E0B" />
          </View>
        </BlurView>

        {/* Camera Container */}
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          >
            {/* Scan Frame */}
            <Animated.View
              style={[
                styles.scanFrame,
                {
                  transform: [{ translateY: floatingTransform }],
                },
              ]}
            >
              <View style={styles.frameCorner} />
              <View style={[styles.frameCorner, styles.topRight]} />
              <View style={[styles.frameCorner, styles.bottomLeft]} />
              <View style={[styles.frameCorner, styles.bottomRight]} />
              
              {/* Animated scan line */}
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanLineTransform }],
                  },
                ]}
              />
              
              {/* Apple illustration in center */}
              <View style={styles.appleContainer}>
                <Animated.View
                  style={[
                    styles.apple,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.appleBody}
                  />
                  <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.appleLeaf}
                  />
                </Animated.View>
              </View>
            </Animated.View>
          </CameraView>
        </View>

        {/* Instruction Text */}
        <BlurView intensity={20} style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Align the food within the frame to scan
          </Text>
        </BlurView>

        {/* Capture Button */}
        <View style={styles.captureContainer}>
          <Animated.View
            style={[
              styles.captureButtonContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={isProcessing ? ['#6B7280', '#4B5563'] : ['#3B82F6', '#1D4ED8']}
                style={styles.captureButtonGradient}
              >
                {isProcessing ? (
                  <Animated.View
                    style={[
                      styles.processingIndicator,
                      {
                        transform: [{ rotate: '360deg' }],
                      },
                    ]}
                  />
                ) : (
                  <Camera size={32} color="#ffffff" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
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
  safeArea: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#F8FAFC',
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionBlur: {
    borderRadius: 24,
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  permissionContent: {
    alignItems: 'center',
  },
  permissionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  permissionMessage: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
    letterSpacing: 0.2,
  },
  permissionButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  permissionButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  permissionButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#60A5FA',
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#60A5FA',
    opacity: 0.8,
  },
  appleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  apple: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  appleBody: {
    width: 80,
    height: 70,
    borderRadius: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  appleLeaf: {
    position: 'absolute',
    top: -5,
    right: 25,
    width: 20,
    height: 15,
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  instructionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    color: '#F8FAFC',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  captureContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButtonContainer: {
    borderRadius: 50,
  },
  captureButton: {
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingIndicator: {
    width: 32,
    height: 32,
    borderWidth: 3,
    borderColor: '#ffffff',
    borderTopColor: 'transparent',
    borderRadius: 16,
  },
});