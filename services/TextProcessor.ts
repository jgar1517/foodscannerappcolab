export interface TextProcessingResult {
  ingredients: string[];
  confidence: number;
  rawText: string;
}

export interface IngredientInfo {
  name: string;
  confidence: number;
}

export class TextProcessor {
  private static instance: TextProcessor;

  private constructor() {}

  public static getInstance(): TextProcessor {
    if (!TextProcessor.instance) {
      TextProcessor.instance = new TextProcessor();
    }
    return TextProcessor.instance;
  }

  public parseIngredients(text: string): TextProcessingResult {
    // Clean and normalize the text
    const cleanedText = this.cleanText(text);
    
    // Extract ingredients from the cleaned text
    const ingredients = this.extractIngredients(cleanedText);
    
    // Calculate confidence based on ingredient quality
    const confidence = this.calculateConfidence(ingredients, cleanedText);
    
    return {
      ingredients: ingredients.map(ing => ing.name),
      confidence,
      rawText: text
    };
  }

  public validateIngredientList(result: TextProcessingResult): boolean {
    // Check if we have any ingredients
    if (!result.ingredients || result.ingredients.length === 0) {
      return false;
    }

    // Check if confidence is above minimum threshold
    if (result.confidence < 0.3) {
      return false;
    }

    // Check if we have at least one meaningful ingredient
    const meaningfulIngredients = result.ingredients.filter(ingredient => 
      ingredient.length > 2 && 
      !this.isCommonNoise(ingredient)
    );

    return meaningfulIngredients.length > 0;
  }

  private cleanText(text: string): string {
    return text
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s,().-]/g, '')
      .trim();
  }

  private extractIngredients(text: string): IngredientInfo[] {
    // Look for ingredient list patterns
    const ingredientPatterns = [
      /ingredients?\s*:?\s*(.+)/i,
      /contains?\s*:?\s*(.+)/i,
      /made\s+with\s*:?\s*(.+)/i
    ];

    let ingredientText = text;
    
    // Try to find ingredient section
    for (const pattern of ingredientPatterns) {
      const match = text.match(pattern);
      if (match) {
        ingredientText = match[1];
        break;
      }
    }

    // Split by common separators
    const rawIngredients = ingredientText
      .split(/[,;]/)
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);

    // Process each ingredient
    return rawIngredients.map(ingredient => ({
      name: this.normalizeIngredient(ingredient),
      confidence: this.calculateIngredientConfidence(ingredient)
    }));
  }

  private normalizeIngredient(ingredient: string): string {
    return ingredient
      .replace(/\([^)]*\)/g, '') // Remove parentheses content
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
  }

  private calculateIngredientConfidence(ingredient: string): number {
    let confidence = 0.5; // Base confidence

    // Boost confidence for common ingredient patterns
    if (/^[a-zA-Z\s]+$/.test(ingredient)) {
      confidence += 0.2;
    }

    // Reduce confidence for very short or very long ingredients
    if (ingredient.length < 3) {
      confidence -= 0.3;
    } else if (ingredient.length > 50) {
      confidence -= 0.2;
    }

    // Boost confidence for known ingredient words
    const knownIngredients = ['water', 'sugar', 'salt', 'oil', 'flour', 'milk', 'egg'];
    if (knownIngredients.some(known => ingredient.toLowerCase().includes(known))) {
      confidence += 0.2;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  private calculateConfidence(ingredients: IngredientInfo[], rawText: string): number {
    if (ingredients.length === 0) {
      return 0;
    }

    // Average ingredient confidence
    const avgIngredientConfidence = ingredients.reduce((sum, ing) => sum + ing.confidence, 0) / ingredients.length;
    
    // Text quality factors
    let textQuality = 0.5;
    
    // Boost for ingredient keywords
    if (/ingredients?\s*:/i.test(rawText)) {
      textQuality += 0.2;
    }
    
    // Boost for reasonable length
    if (rawText.length > 20 && rawText.length < 500) {
      textQuality += 0.1;
    }
    
    // Combine factors
    return (avgIngredientConfidence * 0.7) + (textQuality * 0.3);
  }

  private isCommonNoise(ingredient: string): boolean {
    const noiseWords = ['and', 'or', 'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for'];
    return noiseWords.includes(ingredient.toLowerCase()) || ingredient.length < 2;
  }
}