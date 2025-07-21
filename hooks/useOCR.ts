import { useState, useCallback } from 'react';
import OCRService, { OCRResult } from '@/services/OCRService';
import TextProcessor, { TextProcessingResult } from '@/services/TextProcessor';

export interface OCRState {
  isProcessing: boolean;
  ocrResult: OCRResult | null;
  textProcessingResult: TextProcessingResult | null;
  error: string | null;
}

export interface UseOCRReturn extends OCRState {
  processImage: (imageUri: string) => Promise<void>;
  reset: () => void;
}

export function useOCR(): UseOCRReturn {
  const [state, setState] = useState<OCRState>({
    isProcessing: false,
    ocrResult: null,
    textProcessingResult: null,
    error: null,
  });

  const processImage = useCallback(async (imageUri: string) => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
    }));

    try {
      // Step 1: Extract text using OCR
      const ocrService = OCRService.getInstance();
      const ocrResult = await ocrService.extractText(imageUri);

      // Step 2: Extract ingredient list from full text
      const ingredientText = ocrService.extractIngredientList(ocrResult.text);

      // Step 3: Validate that we have ingredient text
      if (!ocrService.validateIngredientText(ingredientText)) {
        throw new Error('No ingredient list found in the image');
      }

      // Step 4: Parse ingredients
      const textProcessor = TextProcessor.getInstance();
      const textProcessingResult = textProcessor.parseIngredients(ingredientText);

      // Step 5: Validate parsed ingredients
      if (!textProcessor.validateIngredientList(textProcessingResult.ingredients)) {
        throw new Error('Could not identify valid ingredients in the text');
      }

      setState({
        isProcessing: false,
        ocrResult,
        textProcessingResult,
        error: null,
      });
    } catch (error) {
      console.error('OCR processing failed:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'OCR processing failed',
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      ocrResult: null,
      textProcessingResult: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    processImage,
    reset,
  };
}