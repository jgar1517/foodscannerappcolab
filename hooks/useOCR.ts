import { useState } from 'react';
import { OCRService } from '@/services/OCRService';

export interface OCRResult {
  ingredients: string[];
  confidence: number;
  rawText: string;
}

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (imageUri: string): Promise<OCRResult | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('Starting OCR processing for image:', imageUri);
      
      // Initialize OCR service
      const ocrService = new OCRService();

      // Process the image
      const result = await ocrService.processImage(imageUri);
      
      console.log('OCR processing completed:', result);
      
      if (!result.ingredients || result.ingredients.length === 0) {
        throw new Error('No ingredients found in the image');
      }

      // Transform the result to match expected format
      const ocrResult: OCRResult = {
        ingredients: result.ingredients.map(ing => ing.name),
        confidence: result.confidence,
        rawText: result.extractedText
      };

      // Cleanup
      await ocrService.cleanup();

      return ocrResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OCR processing failed';
      setError(errorMessage);
      console.error('OCR processing failed:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processImage,
    isProcessing,
    error,
  };
}