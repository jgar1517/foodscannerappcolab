import * as ImageManipulator from 'expo-image-manipulator';
import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export interface ImagePreprocessingOptions {
  resize?: { width: number; height: number };
  rotate?: number;
  flip?: ImageManipulator.FlipType;
  crop?: ImageManipulator.CropOptions;
}

class OCRService {
  private static instance: OCRService;

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  /**
   * Preprocess image to improve OCR accuracy
   */
  async preprocessImage(
    imageUri: string,
    options: ImagePreprocessingOptions = {}
  ): Promise<string> {
    try {
      const actions: ImageManipulator.Action[] = [];

      // Resize image if specified (helps with performance)
      if (options.resize) {
        actions.push({
          resize: options.resize,
        });
      }

      // Rotate image if needed
      if (options.rotate) {
        actions.push({
          rotate: options.rotate,
        });
      }

      // Flip image if needed
      if (options.flip) {
        actions.push({
          flip: options.flip,
        });
      }

      // Crop image if specified
      if (options.crop) {
        actions.push({
          crop: options.crop,
        });
      }

      // Apply contrast and brightness adjustments for better OCR
      actions.push({
        resize: { width: 800 }, // Standardize width for consistent processing
      });

      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        actions,
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return result.uri;
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      return imageUri; // Return original if preprocessing fails
    }
  }

  /**
   * Extract text from image using Tesseract OCR
   */
  async extractText(imageUri: string): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      // Preprocess image for better OCR accuracy
      const processedImageUri = await this.preprocessImage(imageUri, {
        resize: { width: 800, height: 600 },
      });

      // Configure Tesseract for ingredient label recognition
      const { data } = await Tesseract.recognize(processedImageUri, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,()[]- ',
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
      });

      const processingTime = Date.now() - startTime;
      const cleanedText = this.cleanExtractedText(data.text);

      return {
        text: cleanedText,
        confidence: data.confidence,
        processingTime: processingTime / 1000, // Convert to seconds
      };
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Clean and normalize extracted text
   */
  private cleanExtractedText(rawText: string): string {
    return rawText
      // Remove extra whitespace and normalize line breaks
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      // Remove common OCR artifacts
      .replace(/[|]/g, 'I')
      .replace(/[0]/g, 'O')
      // Clean up punctuation
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\.\s*/g, '. ')
      // Remove leading/trailing whitespace
      .trim();
  }

  /**
   * Validate if extracted text looks like an ingredient list
   */
  validateIngredientText(text: string): boolean {
    // Basic validation - check for common ingredient list patterns
    const ingredientPatterns = [
      /ingredients:/i,
      /contains:/i,
      /,/g, // Comma-separated items
      /\b(water|sugar|salt|oil|flour)\b/i, // Common ingredients
    ];

    return ingredientPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Extract ingredient list from full text
   */
  extractIngredientList(fullText: string): string {
    // Look for "Ingredients:" or similar labels
    const ingredientMatch = fullText.match(/ingredients:?\s*(.+?)(?:\.|$)/i);
    if (ingredientMatch) {
      return ingredientMatch[1].trim();
    }

    // If no "Ingredients:" label found, assume the whole text is ingredients
    return fullText;
  }
}

export default OCRService;