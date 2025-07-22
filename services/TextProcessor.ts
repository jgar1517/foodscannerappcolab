import type { ProcessedIngredient } from '../hooks/useOCR';

export class TextProcessor {
  private commonIngredients = new Map([
    // Safe ingredients
    ['water', { rating: 'safe', explanation: 'Pure water is completely safe and essential for hydration.' }],
    ['salt', { rating: 'caution', explanation: 'Essential mineral, but excessive consumption may lead to health issues.' }],
    ['sugar', { rating: 'caution', explanation: 'Natural sweetener, but high consumption may contribute to health issues.' }],
    ['citric acid', { rating: 'safe', explanation: 'Natural preservative and flavor enhancer, generally recognized as safe.' }],
    ['ascorbic acid', { rating: 'safe', explanation: 'Vitamin C, essential vitamin and antioxidant, beneficial for health.' }],
    ['vitamin c', { rating: 'safe', explanation: 'Essential vitamin and antioxidant, beneficial for health.' }],
    
    // Caution ingredients
    ['natural flavors', { rating: 'caution', explanation: 'Generally safe but can be vague term covering many compounds.' }],
    ['artificial flavors', { rating: 'caution', explanation: 'Synthetic compounds that may cause sensitivities in some people.' }],
    ['corn syrup', { rating: 'caution', explanation: 'High fructose sweetener linked to various health concerns.' }],
    ['modified corn starch', { rating: 'caution', explanation: 'Processed starch that may contain traces of chemicals.' }],
    
    // Avoid ingredients
    ['sodium benzoate', { rating: 'avoid', explanation: 'Preservative that may form benzene when combined with vitamin C.' }],
    ['potassium sorbate', { rating: 'caution', explanation: 'Preservative that is generally safe but may cause allergic reactions.' }],
    ['red dye 40', { rating: 'avoid', explanation: 'Artificial coloring linked to hyperactivity in children.' }],
    ['yellow dye 5', { rating: 'avoid', explanation: 'Artificial coloring that may cause allergic reactions.' }],
    ['bha', { rating: 'avoid', explanation: 'Preservative classified as a possible human carcinogen.' }],
    ['bht', { rating: 'avoid', explanation: 'Preservative with potential health risks and hormone disruption.' }],
  ]);

  private allergenKeywords = [
    'milk', 'eggs', 'fish', 'shellfish', 'tree nuts', 'peanuts', 'wheat', 'soybeans',
    'dairy', 'lactose', 'gluten', 'casein', 'whey'
  ];

  async parseIngredients(text: string): Promise<ProcessedIngredient[]> {
    if (!text || typeof text !== 'string') {
      return [];
    }

    try {
      // Clean and normalize the text
      const cleanedText = this.cleanText(text);
      
      // Extract ingredient list from the text
      const ingredientText = this.extractIngredientList(cleanedText);
      
      // Split into individual ingredients
      const rawIngredients = this.splitIngredients(ingredientText);
      
      // Process each ingredient
      const processedIngredients = rawIngredients
        .map(ingredient => this.processIngredient(ingredient))
        .filter(ingredient => ingredient !== null) as ProcessedIngredient[];

      return processedIngredients;
    } catch (error) {
      console.error('Error parsing ingredients:', error);
      return [];
    }
  }

  private cleanText(text: string): string {
    return text
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[""'']/g, '"')
      .trim();
  }

  private extractIngredientList(text: string): string {
    // Look for common ingredient list indicators
    const indicators = [
      /ingredients?\s*:?\s*(.+)/i,
      /contains?\s*:?\s*(.+)/i,
      /made with\s*:?\s*(.+)/i
    ];

    for (const indicator of indicators) {
      const match = text.match(indicator);
      if (match && match[1]) {
        return match[1];
      }
    }

    // If no indicator found, assume the entire text is ingredients
    return text;
  }

  private splitIngredients(text: string): string[] {
    // Split by commas, but be smart about parentheses
    const ingredients: string[] = [];
    let current = '';
    let parenDepth = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char === '(') {
        parenDepth++;
      } else if (char === ')') {
        parenDepth--;
      } else if (char === ',' && parenDepth === 0) {
        if (current.trim()) {
          ingredients.push(current.trim());
        }
        current = '';
        continue;
      }
      
      current += char;
    }

    // Add the last ingredient
    if (current.trim()) {
      ingredients.push(current.trim());
    }

    return ingredients.filter(ing => ing.length > 0);
  }

  private processIngredient(rawIngredient: string): ProcessedIngredient | null {
    if (!rawIngredient || rawIngredient.trim().length === 0) {
      return null;
    }

    // Clean the ingredient name
    const cleanName = this.cleanIngredientName(rawIngredient);
    
    if (cleanName.length < 2) {
      return null;
    }

    // Get safety information
    const safetyInfo = this.getSafetyInfo(cleanName);
    
    // Detect allergens
    const allergens = this.detectAllergens(cleanName);
    
    // Generate concerns based on safety rating
    const concerns = this.generateConcerns(cleanName, safetyInfo.rating);

    return {
      name: cleanName,
      safetyRating: safetyInfo.rating,
      confidence: this.calculateConfidence(cleanName, safetyInfo.rating),
      explanation: safetyInfo.explanation,
      allergens,
      concerns
    };
  }

  private cleanIngredientName(ingredient: string): string {
    return ingredient
      .replace(/\([^)]*\)/g, '') // Remove parentheses content
      .replace(/\[[^\]]*\]/g, '') // Remove bracket content
      .replace(/[.,;]/g, '') // Remove punctuation
      .trim()
      .toLowerCase();
  }

  private getSafetyInfo(ingredient: string): { rating: 'safe' | 'caution' | 'avoid', explanation: string } {
    // Check exact matches first
    const exactMatch = this.commonIngredients.get(ingredient);
    if (exactMatch) {
      return exactMatch;
    }

    // Check partial matches
    for (const [key, value] of this.commonIngredients.entries()) {
      if (ingredient.includes(key) || key.includes(ingredient)) {
        return value;
      }
    }

    // Default for unknown ingredients
    return {
      rating: 'caution',
      explanation: 'This ingredient is not in our database. Generally, simpler ingredient lists are preferable.'
    };
  }

  private detectAllergens(ingredient: string): string[] {
    const detectedAllergens: string[] = [];
    
    for (const allergen of this.allergenKeywords) {
      if (ingredient.includes(allergen.toLowerCase())) {
        detectedAllergens.push(allergen);
      }
    }

    return detectedAllergens;
  }

  private generateConcerns(ingredient: string, rating: 'safe' | 'caution' | 'avoid'): string[] {
    const concerns: string[] = [];

    if (rating === 'avoid') {
      concerns.push('May pose health risks');
      concerns.push('Consider avoiding this ingredient');
    } else if (rating === 'caution') {
      concerns.push('Consume in moderation');
    }

    // Add specific concerns based on ingredient type
    if (ingredient.includes('artificial') || ingredient.includes('synthetic')) {
      concerns.push('Artificially produced');
    }

    if (ingredient.includes('preservative')) {
      concerns.push('Chemical preservative');
    }

    if (ingredient.includes('color') || ingredient.includes('dye')) {
      concerns.push('Artificial coloring');
    }

    return concerns;
  }

  private calculateConfidence(ingredient: string, rating: 'safe' | 'caution' | 'avoid'): number {
    let confidence = 70; // Base confidence

    // Higher confidence for known ingredients
    if (this.commonIngredients.has(ingredient)) {
      confidence += 20;
    }

    // Adjust based on ingredient complexity
    if (ingredient.split(' ').length === 1) {
      confidence += 10; // Simple ingredients are easier to identify
    }

    // Adjust based on rating certainty
    if (rating === 'safe') {
      confidence += 5;
    } else if (rating === 'avoid') {
      confidence += 10; // We're more certain about problematic ingredients
    }

    return Math.min(confidence, 98); // Cap at 98%
  }
}