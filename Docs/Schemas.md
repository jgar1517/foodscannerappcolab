# Database Schemas - Food Ingredient Safety Scanner

## **Database Architecture Overview**

### **Database System:** Supabase PostgreSQL
### **Design Principles:**
- Normalized data structure for consistency
- Optimized for read-heavy operations
- Scalable schema design
- Row Level Security (RLS) enabled
- Efficient indexing strategy

---

## **Core Tables**

### **1. User Management Tables**

#### **user_profiles**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_premium BOOLEAN DEFAULT false,
  subscription_end_date TIMESTAMPTZ,
  preferences JSONB DEFAULT '{}',
  
  CONSTRAINT user_profiles_email_unique UNIQUE (email)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
```

#### **dietary_preferences**
```sql
CREATE TABLE dietary_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preference_type TEXT NOT NULL, -- 'preset' or 'custom'
  preference_name TEXT NOT NULL, -- 'gluten-free', 'vegan', etc.
  is_active BOOLEAN DEFAULT true,
  custom_ingredients TEXT[], -- Array of custom ingredients to avoid
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT dietary_preferences_user_type_unique UNIQUE (user_id, preference_type, preference_name)
);

ALTER TABLE dietary_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own dietary preferences"
  ON dietary_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);
```

### **2. Ingredient Database Tables**

#### **ingredients**
```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  aliases TEXT[], -- Alternative names for the same ingredient
  category TEXT NOT NULL, -- 'additive', 'preservative', 'natural', etc.
  cas_number TEXT, -- Chemical Abstracts Service number
  e_number TEXT, -- European food additive number
  function TEXT, -- 'coloring', 'flavoring', 'preservative', etc.
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  
  CONSTRAINT ingredients_name_unique UNIQUE (name)
);

-- Create indexes for performance
CREATE INDEX idx_ingredients_name ON ingredients USING gin(to_tsvector('english', name));
CREATE INDEX idx_ingredients_aliases ON ingredients USING gin(aliases);
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_e_number ON ingredients(e_number);
```

#### **safety_ratings**
```sql
CREATE TABLE safety_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('safe', 'caution', 'avoid')),
  source TEXT NOT NULL, -- 'fda', 'ewg', 'custom', etc.
  source_url TEXT,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  explanation TEXT NOT NULL,
  dietary_restrictions TEXT[], -- Which dietary restrictions this affects
  health_concerns TEXT[], -- Specific health concerns
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  
  CONSTRAINT safety_ratings_ingredient_source_unique UNIQUE (ingredient_id, source)
);

CREATE INDEX idx_safety_ratings_ingredient ON safety_ratings(ingredient_id);
CREATE INDEX idx_safety_ratings_rating ON safety_ratings(rating);
CREATE INDEX idx_safety_ratings_dietary_restrictions ON safety_ratings USING gin(dietary_restrictions);
```

### **3. Scan Processing Tables**

#### **scan_sessions**
```sql
CREATE TABLE scan_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  original_text TEXT, -- Raw OCR output
  processed_text TEXT, -- Cleaned and parsed text
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days')
);

ALTER TABLE scan_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own scan sessions"
  ON scan_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_scan_sessions_user ON scan_sessions(user_id);
CREATE INDEX idx_scan_sessions_created_at ON scan_sessions(created_at);
```

#### **scan_results**
```sql
CREATE TABLE scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_session_id UUID REFERENCES scan_sessions(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id),
  ingredient_name TEXT NOT NULL,
  safety_rating TEXT NOT NULL CHECK (safety_rating IN ('safe', 'caution', 'avoid')),
  personalized_rating TEXT CHECK (personalized_rating IN ('safe', 'caution', 'avoid')),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  explanation TEXT,
  source_references TEXT[], -- Array of source URLs
  position_in_list INTEGER, -- Position in ingredient list
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT scan_results_session_ingredient_unique UNIQUE (scan_session_id, ingredient_name)
);

CREATE INDEX idx_scan_results_session ON scan_results(scan_session_id);
CREATE INDEX idx_scan_results_ingredient ON scan_results(ingredient_id);
CREATE INDEX idx_scan_results_rating ON scan_results(safety_rating);
```

### **4. Recommendation System Tables**

#### **product_recommendations**
```sql
CREATE TABLE product_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_session_id UUID REFERENCES scan_sessions(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  image_url TEXT,
  retailer TEXT NOT NULL, -- 'amazon', 'walmart', etc.
  product_url TEXT NOT NULL,
  price DECIMAL(10,2),
  safety_score INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
  recommendation_reason TEXT,
  rank INTEGER DEFAULT 1, -- 1-3 for top recommendations
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_product_recommendations_session ON product_recommendations(scan_session_id);
CREATE INDEX idx_product_recommendations_rank ON product_recommendations(rank);
```

#### **recipe_recommendations**
```sql
CREATE TABLE recipe_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_session_id UUID REFERENCES scan_sessions(id) ON DELETE CASCADE,
  recipe_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER, -- in minutes
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  ingredients TEXT[], -- Array of ingredient names
  instructions TEXT[],
  nutrition_info JSONB,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_recipe_recommendations_session ON recipe_recommendations(scan_session_id);
```

### **5. Analytics and Tracking Tables**

#### **usage_analytics**
```sql
CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'scan', 'view_result', 'click_recommendation', etc.
  event_data JSONB,
  scan_session_id UUID REFERENCES scan_sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_usage_analytics_user ON usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_event_type ON usage_analytics(event_type);
CREATE INDEX idx_usage_analytics_timestamp ON usage_analytics(timestamp);
```

#### **feedback**
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_session_id UUID REFERENCES scan_sessions(id) ON DELETE SET NULL,
  feedback_type TEXT NOT NULL, -- 'rating_accuracy', 'recommendation_quality', 'bug_report', etc.
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_resolved BOOLEAN DEFAULT false,
  admin_response TEXT,
  responded_at TIMESTAMPTZ
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## **View Definitions**

### **user_dashboard_view**
```sql
CREATE VIEW user_dashboard_view AS
SELECT 
  up.id,
  up.full_name,
  up.is_premium,
  COUNT(ss.id) as total_scans,
  COUNT(CASE WHEN ss.created_at > now() - interval '30 days' THEN 1 END) as scans_last_30_days,
  COUNT(CASE WHEN ss.created_at > now() - interval '7 days' THEN 1 END) as scans_last_7_days,
  ARRAY_AGG(DISTINCT dp.preference_name) as dietary_preferences
FROM user_profiles up
LEFT JOIN scan_sessions ss ON up.user_id = ss.user_id
LEFT JOIN dietary_preferences dp ON up.user_id = dp.user_id AND dp.is_active = true
GROUP BY up.id, up.full_name, up.is_premium;
```

### **ingredient_safety_summary_view**
```sql
CREATE VIEW ingredient_safety_summary_view AS
SELECT 
  i.id,
  i.name,
  i.category,
  i.e_number,
  COALESCE(
    CASE 
      WHEN sr_fda.rating IS NOT NULL THEN sr_fda.rating
      WHEN sr_ewg.rating IS NOT NULL THEN sr_ewg.rating
      ELSE 'safe'
    END, 'safe'
  ) as primary_rating,
  COALESCE(sr_fda.explanation, sr_ewg.explanation, 'No specific concerns identified') as primary_explanation,
  ARRAY_AGG(DISTINCT sr.source) as sources,
  AVG(sr.confidence_score) as avg_confidence_score
FROM ingredients i
LEFT JOIN safety_ratings sr_fda ON i.id = sr_fda.ingredient_id AND sr_fda.source = 'fda'
LEFT JOIN safety_ratings sr_ewg ON i.id = sr_ewg.ingredient_id AND sr_ewg.source = 'ewg'
LEFT JOIN safety_ratings sr ON i.id = sr.ingredient_id AND sr.is_active = true
WHERE i.is_active = true
GROUP BY i.id, i.name, i.category, i.e_number, sr_fda.rating, sr_fda.explanation, sr_ewg.rating, sr_ewg.explanation;
```

---

## **Triggers and Functions**

### **Update Timestamps Trigger**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dietary_preferences_updated_at BEFORE UPDATE ON dietary_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_ratings_updated_at BEFORE UPDATE ON safety_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scan_sessions_updated_at BEFORE UPDATE ON scan_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Cleanup Expired Scans Function**
```sql
CREATE OR REPLACE FUNCTION cleanup_expired_scans()
RETURNS void AS $$
BEGIN
    DELETE FROM scan_sessions 
    WHERE expires_at < now();
    
    DELETE FROM usage_analytics 
    WHERE timestamp < now() - interval '1 year';
END;
$$ language 'plpgsql';

-- Schedule daily cleanup (requires pg_cron extension)
SELECT cron.schedule('cleanup-expired-scans', '0 2 * * *', 'SELECT cleanup_expired_scans();');
```

---

## **Indexing Strategy**

### **Performance Indexes**
```sql
-- Full-text search on ingredient names
CREATE INDEX idx_ingredients_fulltext ON ingredients USING gin(to_tsvector('english', name || ' ' || coalesce(array_to_string(aliases, ' '), '')));

-- Composite indexes for common queries
CREATE INDEX idx_scan_results_session_rating ON scan_results(scan_session_id, safety_rating);
CREATE INDEX idx_safety_ratings_ingredient_rating ON safety_ratings(ingredient_id, rating);
CREATE INDEX idx_user_preferences_active ON dietary_preferences(user_id, is_active);

-- Partial indexes for active records
CREATE INDEX idx_ingredients_active ON ingredients(name) WHERE is_active = true;
CREATE INDEX idx_safety_ratings_active ON safety_ratings(ingredient_id, rating) WHERE is_active = true;
```

### **Partitioning Strategy**
```sql
-- Partition usage_analytics by month for better performance
CREATE TABLE usage_analytics_template (
  LIKE usage_analytics INCLUDING ALL
);

-- Create monthly partitions (example for 2025)
CREATE TABLE usage_analytics_2025_01 PARTITION OF usage_analytics_template
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE usage_analytics_2025_02 PARTITION OF usage_analytics_template
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

---

## **Data Integrity Constraints**

### **Business Logic Constraints**
```sql
-- Ensure confidence scores are realistic
ALTER TABLE safety_ratings ADD CONSTRAINT check_confidence_score 
  CHECK (confidence_score >= 0 AND confidence_score <= 100);

-- Ensure rating values are valid
ALTER TABLE safety_ratings ADD CONSTRAINT check_rating_values 
  CHECK (rating IN ('safe', 'caution', 'avoid'));

-- Ensure scan sessions have valid status
ALTER TABLE scan_sessions ADD CONSTRAINT check_processing_status 
  CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'));

-- Ensure recommendation ranks are valid
ALTER TABLE product_recommendations ADD CONSTRAINT check_recommendation_rank 
  CHECK (rank >= 1 AND rank <= 3);
```

### **Reference Integrity**
```sql
-- Cascade deletes for user data
ALTER TABLE scan_sessions DROP CONSTRAINT IF EXISTS scan_sessions_user_id_fkey;
ALTER TABLE scan_sessions ADD CONSTRAINT scan_sessions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Protect ingredient data integrity
ALTER TABLE safety_ratings ADD CONSTRAINT safety_ratings_ingredient_id_fkey 
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT;
```