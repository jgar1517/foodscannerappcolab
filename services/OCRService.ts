import { createWorker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

export interface IngredientList {
  ingredients: string[];
  confidence: number;
  rawText: string;
}

export class OCRService {
  private worker: any = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.worker = await createWorker('eng');
      await this.worker.setParameters({
        tessedit_pageseg_mode: '6', // Uniform block of text
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,()- ',
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
      throw new Error('OCR initialization failed');
    }
  }

  async extractText(imageUri: string): Promise<OCRResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const { data } = await this.worker.recognize(imageUri);
      return {
        text: data.text.trim(),
        confidence: data.confidence / 100, // Convert to 0-1 scale
      };
    } catch (error) {
      console.error('OCR text extraction failed:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async extractIngredientList(imageUri: string): Promise<IngredientList> {
    const ocrResult = await this.extractText(imageUri);
    
    if (!ocrResult.text || ocrResult.text.length < 10) {
      throw new Error('No ingredient list found in the image');
    }

    // Look for ingredient list patterns
    const ingredientPatterns = [
      /ingredients?\s*:?\s*(.+)/i,
      /contains?\s*:?\s*(.+)/i,
      /made\s+with\s*:?\s*(.+)/i,
    ];

    let ingredientText = '';
    for (const pattern of ingredientPatterns) {
      const match = ocrResult.text.match(pattern);
      if (match) {
        ingredientText = match[1];
        break;
      }
    }

    // If no pattern found, use the entire text
    if (!ingredientText) {
      ingredientText = ocrResult.text;
    }

    // Parse ingredients
    const ingredients = this.parseIngredients(ingredientText);
    
    if (ingredients.length === 0) {
      throw new Error('Could not identify valid ingredients in the text');
    }

    return {
      ingredients,
      confidence: ocrResult.confidence,
      rawText: ocrResult.text,
    };
  }

  private parseIngredients(text: string): string[] {
    // Clean up the text
    let cleanText = text
      .replace(/[()]/g, '') // Remove parentheses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Split by common delimiters
    const ingredients = cleanText
      .split(/[,;]/)
      .map(ingredient => ingredient.trim())
      .filter(ingredient => {
        // Filter out invalid ingredients
        return ingredient.length > 1 && 
               ingredient.length < 50 && 
               /^[a-zA-Z]/.test(ingredient); // Must start with letter
      })
      .map(ingredient => {
        // Clean up individual ingredients
        return ingredient
          .replace(/^\W+|\W+$/g, '') // Remove leading/trailing non-word chars
          .toLowerCase()
          .replace(/\b\w/g, l => l.toUpperCase()); // Title case
      });

    return ingredients;
  }

  validateIngredientText(text: string): boolean {
    if (!text || text.length < 5) return false;
    
    // Check for common ingredient list indicators
    const indicators = [
      /ingredients/i,
      /contains/i,
      /made with/i,
      /[,;]/, // Contains separators
    ];

    return indicators.some(pattern => pattern.test(text));
  }

  async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

export const ocrService = new OCRService();

export default OCRService