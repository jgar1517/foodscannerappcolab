export interface ParsedIngredient {
  name: string;
  originalText: string;
  position: number;
  confidence: number;
}

export interface TextProcessingResult {
  ingredients: ParsedIngredient[];
  totalIngredients: number;
  processingTime: number;
}

class TextProcessor {
  private static instance: TextProcessor;

  public static getInstance(): TextProcessor {
    if (!TextProcessor.instance) {
      TextProcessor.instance = new TextProcessor();
    }
    return TextProcessor.instance;
  }

  /**
   * Parse ingredient list text into individual ingredients
   */
  parseIngredients(ingredientText: string): TextProcessingResult {
    const startTime = Date.now();

    try {
      // Clean the text first
      const cleanedText = this.cleanIngredientText(ingredientText);
      
      // Split by commas and process each ingredient
      const rawIngredients = cleanedText.split(',');
      const ingredients: ParsedIngredient[] = [];

      rawIngredients.forEach((ingredient, index) => {
        const cleanedIngredient = this.cleanIndividualIngredient(ingredient);
        
        if (cleanedIngredient && cleanedIngredient.length > 1) {
          ingredients.push({
            name: cleanedIngredient,
            originalText: ingredient.trim(),
            position: index + 1,
            confidence: this.calculateIngredientConfidence(cleanedIngredient),
          });
        }
      });

      const processingTime = Date.now() - startTime;

      return {
        ingredients,
        totalIngredients: ingredients.length,
        processingTime: processingTime / 1000,
      };
    } catch (error) {
      console.error('Text processing failed:', error);
      throw new Error('Failed to parse ingredient text');
    }
  }

  /**
   * Clean the full ingredient text
   */
  private cleanIngredientText(text: string): string {
    return text
      // Remove "Ingredients:" label if present
      .replace(/^ingredients:?\s*/i, '')
      // Remove parenthetical information for now (we'll handle this better later)
      .replace(/\([^)]*\)/g, '')
      // Remove square brackets
      .replace(/\[[^\]]*\]/g, '')
      // Clean up spacing
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Clean individual ingredient name
   */
  private cleanIndividualIngredient(ingredient: string): string {
    return ingredient
      .trim()
      // Remove leading/trailing punctuation
      .replace(/^[.,;:\s]+|[.,;:\s]+$/g, '')
      // Normalize capitalization (title case)
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())
      // Remove extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculate confidence score for ingredient identification
   */
  private calculateIngredientConfidence(ingredient: string): number {
    let confidence = 80; // Base confidence

    // Increase confidence for known common ingredients
    const commonIngredients = [
      'water', 'sugar', 'salt', 'oil', 'flour', 'milk', 'eggs',
      'butter', 'vanilla', 'baking powder', 'citric acid', 'natural flavors'
    ];

    if (commonIngredients.some(common => 
      ingredient.toLowerCase().includes(common.toLowerCase())
    )) {
      confidence += 15;
    }

    // Decrease confidence for very short or very long names
    if (ingredient.length < 3) {
      confidence -= 30;
    } else if (ingredient.length > 50) {
      confidence -= 20;
    }

    // Decrease confidence for ingredients with numbers (might be OCR errors)
    if (/\d/.test(ingredient)) {
      confidence -= 10;
    }

    return Math.max(0, Math.min(100, confidence));
  }

  /**
   * Validate if text looks like a proper ingredient list
   */
  validateIngredientList(ingredients: ParsedIngredient[]): boolean {
    // Must have at least 2 ingredients
    if (ingredients.length < 2) {
      return false;
    }

    // At least 70% of ingredients should have decent confidence
    const highConfidenceCount = ingredients.filter(ing => ing.confidence >= 70).length;
    const confidenceRatio = highConfidenceCount / ingredients.length;

    return confidenceRatio >= 0.7;
  }

  /**
   * Get ingredient suggestions for potential OCR errors
   */
  suggestCorrections(ingredient: string): string[] {
    const suggestions: string[] = [];
    
    // Common OCR corrections
    const corrections: { [key: string]: string } = {
      'suqar': 'sugar',
      'waler': 'water',
      'sall': 'salt',
      'oii': 'oil',
      'milx': 'milk',
      'buttcr': 'butter',
      'vanilia': 'vanilla',
    };

    const corrected = corrections[ingredient.toLowerCase()];
    if (corrected) {
      suggestions.push(corrected);
    }

    return suggestions;
  }
}

export default TextProcessor;