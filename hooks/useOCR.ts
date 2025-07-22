import { useState } from 'react';
import { OCRService } from '@/services/OCRService';
import { TextProcessor } from '@/services/TextProcessor';

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
      // Initialize services
      const ocrService = new OCRService();
      const textProcessor = new TextProcessor();

      // Extract text from image
      const extractedText = await ocrService.extractText(imageUri);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text found in the image');
      }

      // Parse ingredients from text
      const result = textProcessor.parseIngredients(extractedText);
      
      if (!textProcessor.validateIngredientList(result)) {
        throw new Error('Could not identify valid ingredients in the text');
      }

      return result;
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