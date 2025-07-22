import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, FlipHorizontal, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useOCR } from '@/hooks/useOCR';
import { GlassmorphismCard } from '@/components/GlassmorphismCard';

export default function ScanTab() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { processImage } = useOCR();

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <GlassmorphismCard style={styles.permissionCard}>
          <Camera size={64} color="#8B5CF6" style={styles.permissionIcon} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan ingredient labels and analyze their safety.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </GlassmorphismCard>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async (camera: any) => {
    if (!camera || isProcessing) return;

    try {
      setIsProcessing(true);
      
      const photo = await camera.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      setShowCamera(false);

      if (photo?.uri) {
        try {
          const result = await processImage(photo.uri);
          
          if (result) {
            const scanData = {
              ingredients: result.ingredients.map((name, index) => ({
                name,
                rating: 'safe',
                explanation: 'Analyzed by OCR processing',
                confidence: result.confidence,
                position: index + 1,
                sources: ['OCR Analysis']
              })),
              confidence: result.confidence,
              rawText: result.rawText
            };

            router.push({
              pathname: '/results',
              params: {
                fromScan: 'true',
                scanData: JSON.stringify(scanData),
              },
            });
          }
        } catch (ocrError) {
          console.error('OCR processing error:', ocrError);
          Alert.alert('Processing Error', 'Failed to analyze the image. Please try again with a clearer photo.');
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Camera Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={(ref) => {
            if (ref) {
              (ref as any).takePictureAsync = (ref as any).takePictureAsync?.bind(ref);
            }
          }}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCamera(false)}
              >
                <X size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan Ingredient Label</Text>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <FlipHorizontal size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.scanFrame}>
              <View style={styles.scanCorner} />
              <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
              <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
              <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
            </View>

            <View style={styles.cameraFooter}>
              <Text style={styles.instructionText}>
                Position the ingredient label within the frame
              </Text>
              <TouchableOpacity
                style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
                onPress={() => {
                  const camera = (global as any).cameraRef;
                  takePicture(camera);
                }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Camera size={32} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Ingredients</Text>
        <Text style={styles.subtitle}>
          Take a photo of ingredient labels to analyze their safety
        </Text>
      </View>

      <GlassmorphismCard style={styles.scanCard}>
        <Camera size={80} color="#8B5CF6" style={styles.scanIcon} />
        <Text style={styles.scanTitle}>Ready to Scan</Text>
        <Text style={styles.scanDescription}>
          Point your camera at any ingredient label to get instant safety analysis
        </Text>
        
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setShowCamera(true)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <ActivityIndicator size="small" color="white" style={styles.buttonIcon} />
              <Text style={styles.scanButtonText}>Processing...</Text>
            </>
          ) : (
            <>
              <Camera size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.scanButtonText}>Open Camera</Text>
            </>
          )}
        </TouchableOpacity>
      </GlassmorphismCard>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Tips for Better Results</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Ensure good lighting</Text>
          <Text style={styles.tipItem}>• Keep the label flat and straight</Text>
          <Text style={styles.tipItem}>• Get close enough to read the text clearly</Text>
          <Text style={styles.tipItem}>• Avoid shadows and glare</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 24,
  },
  scanCard: {
    alignItems: 'center',
    padding: 40,
    marginBottom: 30,
  },
  scanIcon: {
    marginBottom: 20,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  scanDescription: {
    fontSize: 16,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  scanButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  tips: {
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#A1A1AA',
    lineHeight: 20,
  },
  permissionCard: {
    alignItems: 'center',
    padding: 40,
  },
  permissionIcon: {
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#8B5CF6',
    borderWidth: 3,
    top: '30%',
    left: '20%',
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  scanCornerTopRight: {
    left: '80%',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  scanCornerBottomLeft: {
    top: '70%',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  scanCornerBottomRight: {
    top: '70%',
    left: '80%',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonDisabled: {
    backgroundColor: '#6B7280',
  },
});