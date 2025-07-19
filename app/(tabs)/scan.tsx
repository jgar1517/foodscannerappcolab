import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permissions are loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={80} color="#22C55E" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need access to your camera to scan food items and provide nutritional analysis.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          setCapturedImage(photo.uri);
          // Simulate processing and navigate to results
          setTimeout(() => {
            router.push('/results');
          }, 1000);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Food</Text>
      </View>

      {/* Camera Container */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          {/* Scan Frame */}
          <View style={styles.scanFrame}>
            <View style={styles.frameCorner} />
            <View style={[styles.frameCorner, styles.topRight]} />
            <View style={[styles.frameCorner, styles.bottomLeft]} />
            <View style={[styles.frameCorner, styles.bottomRight]} />
            
            {/* Apple illustration in center */}
            <View style={styles.appleContainer}>
              <View style={styles.apple}>
                <View style={styles.appleBody} />
                <View style={styles.appleLeaf} />
              </View>
            </View>
          </View>
        </CameraView>
      </View>

      {/* Instruction Text */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Align the food within the frame to scan
        </Text>
      </View>

      {/* Capture Button */}
      <View style={styles.captureContainer}>
        <TouchableOpacity 
          style={styles.captureButton}
          onPress={takePicture}
        >
          <Camera size={32} color="#15803D" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15803D',
  },
  message: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#15803D',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#DCFCE7',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
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
    borderColor: '#ffffff',
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
    backgroundColor: '#ef4444',
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
    backgroundColor: '#22C55E',
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  instructionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  captureContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});