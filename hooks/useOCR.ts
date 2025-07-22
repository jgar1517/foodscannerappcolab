import { useState } from 'react';
import { OCRService } from '../services/OCRService';
import { TextProcessor } from '../services/TextProcessor';

export interface OCRResult {
  extractedText: string;
  ingredients: ProcessedIngredient[];
  confidence: number;
  processingTime: number;
}

export interface ProcessedIngredient {
  name: string;
  safetyRating: 'safe' | 'caution' | 'avoid';
  confidence: number;
  explanation: string;
  allergens?: string[];
  concerns?: string[];
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OCRResult | null>(null);

  const ocrService = new OCRService();
  const textProcessor = new TextProcessor();

  // Validate OCR extraction result
  const validateOCRResult = (text: string): ValidationResult => {
    if (!text || typeof text !== 'string') {
      return { isValid: false, error: 'No text was extracted from the image' };
    }

    if (text.trim().length < 3) {
      return { isValid: false, error: 'Text too short - please try again with better lighting' };
    }

    // Check for common OCR artifacts that indicate poor quality
    const ocrArtifacts = /^[^a-zA-Z]*$|^\W+$|^[\d\s\W]*$/;
    if (ocrArtifacts.test(text.trim())) {
      return { isValid: false, error: 'Could not read text clearly - please ensure the label is well-lit and in focus' };
    }

    return { isValid: true };
  };

  // Validate processed ingredients result
  const validateIngredientsResult = (ingredients: any[]): ValidationResult => {
    if (!Array.isArray(ingredients)) {
      return { isValid: false, error: 'Failed to process ingredients - please try again' };
    }

    if (ingredients.length === 0) {
      return { isValid: false, error: 'No ingredients found - please ensure the ingredient list is visible and clear' };
    }

    // Validate individual ingredients
    const invalidIngredients = ingredients.filter(ingredient => 
      !ingredient || 
      typeof ingredient.name !== 'string' || 
      ingredient.name.trim().length === 0 ||
      !['safe', 'caution', 'avoid'].includes(ingredient.safetyRating)
    );

    if (invalidIngredients.length > 0) {
      return { isValid: false, error: 'Some ingredients could not be analyzed properly - please try again' };
    }

    return { isValid: true };
  };

  // Convert technical errors to user-friendly messages
  const getUserFriendlyError = (error: any): string => {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    if (errorMessage.includes('permission')) {
      return 'Camera permission is required to scan ingredients';
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Network error - please check your connection and try again';
    }
    
    if (errorMessage.includes('timeout')) {
      return 'Processing took too long - please try again';
    }
    
    if (errorMessage.includes('format') || errorMessage.includes('invalid')) {
      return 'Image format not supported - please try a different photo';
    }
    
    return 'Something went wrong - please try taking another photo';
  };

  const processImage = async (imageUri: string): Promise<OCRResult | null> => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const startTime = Date.now();

      // Step 1: Extract text from image
      const extractedText = await ocrService.extractText(imageUri);
      
      // Step 2: Validate OCR result
      const ocrValidation = validateOCRResult(extractedText);
      if (!ocrValidation.isValid) {
        throw new Error(ocrValidation.error);
      }

      // Step 3: Process ingredients
      const ingredients = await textProcessor.parseIngredients(extractedText);
      
      // Step 4: Validate ingredients result
      const ingredientsValidation = validateIngredientsResult(ingredients);
      if (!ingredientsValidation.isValid) {
        throw new Error(ingredientsValidation.error);
      }

      const processingTime = Date.now() - startTime;
      
      // Step 5: Calculate overall confidence
      const avgConfidence = ingredients.reduce((sum, ing) => sum + ing.confidence, 0) / ingredients.length;
      
      const ocrResult: OCRResult = {
        extractedText,
        ingredients,
        confidence: Math.round(avgConfidence),
        processingTime
      };

      setResult(ocrResult);
      return ocrResult;

    } catch (err) {
      const friendlyError = getUserFriendlyError(err);
      setError(friendlyError);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  return {
    processImage,
    clearResults,
    isProcessing,
    error,
    result
  };
};