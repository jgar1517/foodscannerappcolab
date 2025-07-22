export interface IngredientAnalysis {
  name: string;
  safetyRating: 'safe' | 'caution' | 'avoid';
  concerns: string[];
  description: string;
  confidence: number;
  position: number;
  sources: string[];
}

export interface OCRResult {
  extractedText: string;
  ingredients: IngredientAnalysis[];
  confidence: number;
}

export class OCRService {
  private worker: any = null;

  async initializeWorker() {
    if (this.worker) return this.worker;

    try {
      const Tesseract = await import('tesseract.js');
      this.worker = await Tesseract.createWorker('eng');
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,()- ',
      });
      return this.worker;
    } catch (error) {
      console.error('Failed to initialize Tesseract worker:', error);
      throw new Error('OCR initialization failed');
    }
  }

  async extractText(imageUri: string): Promise<string> {
    try {
      console.log('Starting OCR processing for:', imageUri);
      
      const worker = await this.initializeWorker();
      const { data: { text } } = await worker.recognize(imageUri);
      
      console.log('OCR extracted text:', text);
      
      if (!text || text.trim().length === 0) {
        throw new Error('No text found in the image');
      }

      return text.trim();
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async analyzeIngredients(text: string): Promise<IngredientAnalysis[]> {
    try {
      console.log('Analyzing ingredients from text:', text);
      
      // Find ingredient list in the text
      const ingredientText = this.extractIngredientSection(text);
      console.log('Extracted ingredient section:', ingredientText);
      
      // Parse individual ingredients
      const rawIngredients = this.parseIngredientList(ingredientText);
      console.log('Parsed ingredients:', rawIngredients);
      
      // Analyze each ingredient for safety
      const analyzedIngredients = rawIngredients.map((ingredient, index) => 
        this.analyzeIngredient(ingredient, index + 1)
      );

      return analyzedIngredients;
    } catch (error) {
      console.error('Ingredient analysis failed:', error);
      throw new Error('Failed to analyze ingredients');
    }
  }

  private extractIngredientSection(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Look for ingredient section markers
    const patterns = [
      /ingredients?\s*:?\s*(.+)/i,
      /contains?\s*:?\s*(.+)/i,
      /made\s+with\s*:?\s*(.+)/i,
      /composition\s*:?\s*(.+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // If no specific pattern found, assume the whole text is ingredients
    return text;
  }

  private parseIngredientList(text: string): string[] {
    // Split by common separators
    const ingredients = text
      .split(/[,;]/)
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0)
      .map(ingredient => this.cleanIngredient(ingredient));

    return ingredients.filter(ingredient => ingredient.length > 2);
  }

  private cleanIngredient(ingredient: string): string {
    return ingredient
      .replace(/\([^)]*\)/g, '') // Remove parentheses content
      .replace(/\[[^\]]*\]/g, '') // Remove bracket content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .replace(/^[^a-zA-Z]*/, '') // Remove leading non-letters
      .replace(/[^a-zA-Z\s]*$/, '') // Remove trailing non-letters
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
  }

  private analyzeIngredient(ingredient: string, position: number): IngredientAnalysis {
    // Enhanced ingredient safety database
    const safetyDatabase = this.getIngredientSafetyDatabase();
    
    // Find matching ingredient (case-insensitive, partial matching)
    const lowerIngredient = ingredient.toLowerCase();
    let matchedData = null;
    
    // Exact match first
    if (safetyDatabase[lowerIngredient]) {
      matchedData = safetyDatabase[lowerIngredient];
    } else {
      // Partial match
      for (const [key, data] of Object.entries(safetyDatabase)) {
        if (lowerIngredient.includes(key) || key.includes(lowerIngredient)) {
          matchedData = data;
          break;
        }
      }
    }

    // Default to safe if not found
    if (!matchedData) {
      matchedData = {
        rating: 'safe' as const,
        concerns: [],
        description: 'No specific safety concerns identified for this ingredient.',
        confidence: 60,
        sources: ['general']
      };
    }

    return {
      name: ingredient,
      safetyRating: matchedData.rating,
      concerns: matchedData.concerns,
      description: matchedData.description,
      confidence: matchedData.confidence,
      position,
      sources: matchedData.sources
    };
  }

  private getIngredientSafetyDatabase() {
    return {
      'water': {
        rating: 'safe' as const,
        concerns: [],
        description: 'Water is essential for life and poses no safety concerns.',
        confidence: 100,
        sources: ['FDA', 'EWG']
      },
      'sugar': {
        rating: 'caution' as const,
        concerns: ['High calorie content', 'May contribute to tooth decay', 'Blood sugar spikes'],
        description: 'High sugar content may contribute to weight gain and dental issues. Moderate consumption recommended.',
        confidence: 85,
        sources: ['EWG', 'WHO']
      },
      'high fructose corn syrup': {
        rating: 'avoid' as const,
        concerns: ['Linked to obesity', 'May cause metabolic issues', 'Associated with diabetes risk'],
        description: 'Linked to obesity, diabetes, and metabolic issues when consumed in large quantities over time.',
        confidence: 89,
        sources: ['EWG', 'WHO']
      },
      'sodium benzoate': {
        rating: 'caution' as const,
        concerns: ['Potential allergen', 'May cause sensitivity in some individuals'],
        description: 'Common preservative, generally recognized as safe but may cause allergic reactions in sensitive individuals.',
        confidence: 75,
        sources: ['FDA', 'EWG']
      },
      'natural flavors': {
        rating: 'caution' as const,
        concerns: ['Vague ingredient term', 'May contain allergens', 'Chemicals not listed'],
        description: 'While generally safe, "natural flavors" can be vague and may contain allergens or chemicals not listed.',
        confidence: 70,
        sources: ['FDA']
      },
      'artificial colors': {
        rating: 'avoid' as const,
        concerns: ['Linked to hyperactivity in children', 'May cause allergic reactions'],
        description: 'Artificial food coloring linked to hyperactivity in children and may cause allergic reactions in sensitive individuals.',
        confidence: 85,
        sources: ['EWG']
      },
      'yellow 5': {
        rating: 'avoid' as const,
        concerns: ['Linked to hyperactivity in children', 'May cause allergic reactions'],
        description: 'Artificial food coloring linked to hyperactivity in children and may cause allergic reactions in sensitive individuals.',
        confidence: 91,
        sources: ['EWG']
      },
      'red 40': {
        rating: 'avoid' as const,
        concerns: ['Linked to hyperactivity in children', 'May cause allergic reactions'],
        description: 'Artificial food coloring that may cause hyperactivity in children and allergic reactions.',
        confidence: 88,
        sources: ['EWG']
      },
      'citric acid': {
        rating: 'safe' as const,
        concerns: [],
        description: 'Natural preservative derived from citrus fruits, generally safe for consumption.',
        confidence: 95,
        sources: ['FDA', 'EWG']
      },
      'salt': {
        rating: 'caution' as const,
        concerns: ['High sodium content', 'May contribute to high blood pressure'],
        description: 'Essential mineral but high sodium intake may contribute to hypertension. Moderate consumption recommended.',
        confidence: 80,
        sources: ['FDA', 'WHO']
      },
      'palm oil': {
        rating: 'caution' as const,
        concerns: ['High in saturated fat', 'Environmental concerns'],
        description: 'High in saturated fat which may raise cholesterol levels. Environmental concerns with production methods.',
        confidence: 88,
        sources: ['EWG']
      },
      'soybean oil': {
        rating: 'safe' as const,
        concerns: [],
        description: 'Commonly used cooking oil that is generally recognized as safe by regulatory authorities.',
        confidence: 88,
        sources: ['FDA']
      },
      'cocoa': {
        rating: 'safe' as const,
        concerns: [],
        description: 'Natural cocoa provides antioxidants and is generally safe for consumption.',
        confidence: 98,
        sources: ['FDA', 'EWG']
      },
      'vanilla': {
        rating: 'safe' as const,
        concerns: [],
        description: 'Natural flavoring that is safe for consumption.',
        confidence: 95,
        sources: ['FDA']
      },
      'baking soda': {
        rating: 'safe' as const,
        concerns: [],
        description: 'Sodium bicarbonate is a safe leavening agent commonly used in baking.',
        confidence: 98,
        sources: ['FDA']
      }
    };
  }

  async processImage(imageUri: string): Promise<OCRResult> {
    try {
      const extractedText = await this.extractText(imageUri);
      const ingredients = await this.analyzeIngredients(extractedText);
      
      // Calculate overall confidence based on text quality and ingredient matches
      const confidence = this.calculateOverallConfidence(extractedText, ingredients);
      
      return {
        extractedText,
        ingredients,
        confidence
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw error;
    }
  }

  private calculateOverallConfidence(text: string, ingredients: IngredientAnalysis[]): number {
    if (ingredients.length === 0) return 0;
    
    // Base confidence on text quality
    let textQuality = 50;
    if (text.toLowerCase().includes('ingredients')) textQuality += 20;
    if (text.length > 20 && text.length < 500) textQuality += 10;
    if (ingredients.length > 2) textQuality += 10;
    
    // Average ingredient confidence
    const avgIngredientConfidence = ingredients.reduce((sum, ing) => sum + ing.confidence, 0) / ingredients.length;
    
    // Combine factors
    return Math.min(95, Math.round((textQuality * 0.3) + (avgIngredientConfidence * 0.7)));
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}