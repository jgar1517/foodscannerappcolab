import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { OCRService } from '../services/OCRService';

export interface OCRResult {
  extractedText: string;
  ingredients: Array<{
    name: string;
    safetyRating: 'safe' | 'caution' | 'avoid';
    confidence: number;
    concerns: string[];
    sources: string[];
  }>;
  overallRating: 'safe' | 'caution' | 'avoid';
  processingTime: number;
}

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<OCRResult | null>(null);

  const processImage = useCallback(async (imageUri: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await OCRService.processImage(imageUri);
      setLastResult(result);
      
      // Navigate to results with the scan data
      router.push({
        pathname: '/(tabs)/results',
        params: { scanData: JSON.stringify(result) }
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OCR processing failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    processImage,
    isProcessing,
    error,
    lastResult,
    clearError
  };
};