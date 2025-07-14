# API Documentation - Food Ingredient Safety Scanner

## **API Overview**

### **Base URL**
- **Development:** `http://localhost:8000/api`
- **Production:** `https://api.foodscanner.app/api`

### **Authentication**
- **Type:** Bearer JWT Token
- **Header:** `Authorization: Bearer <token>`
- **Provider:** Supabase Auth

### **Response Format**
All API responses follow this standard format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "error": null,
  "timestamp": "2025-01-27T10:30:00Z"
}
```

---

## **Authentication Endpoints**

### **1. User Registration**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

### **2. User Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "is_premium": false
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

### **3. Password Reset**
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

## **Image Processing Endpoints**

### **1. Upload Image**
```http
POST /images/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "image": <file>,
  "scan_type": "ingredient_label"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "image_id": "uuid",
    "image_url": "https://storage.supabase.co/object/public/images/uuid.jpg",
    "thumbnail_url": "https://storage.supabase.co/object/public/images/uuid_thumb.jpg",
    "upload_timestamp": "2025-01-27T10:30:00Z"
  },
  "message": "Image uploaded successfully"
}
```

### **2. Process OCR**
```http
POST /images/ocr
Authorization: Bearer <token>
Content-Type: application/json

{
  "image_url": "https://storage.supabase.co/object/public/images/uuid.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "extracted_text": "Ingredients: Water, Sugar, Citric Acid, Natural Flavors, Sodium Benzoate",
    "confidence_score": 95,
    "processing_time": 2.3,
    "detected_language": "en"
  },
  "message": "OCR processing completed"
}
```

---

## **Scan Processing Endpoints**

### **1. Create Scan Session**
```http
POST /scans/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "image_url": "https://storage.supabase.co/object/public/images/uuid.jpg",
  "extracted_text": "Ingredients: Water, Sugar, Citric Acid, Natural Flavors, Sodium Benzoate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scan_session_id": "uuid",
    "status": "processing",
    "created_at": "2025-01-27T10:30:00Z",
    "estimated_completion": "2025-01-27T10:30:30Z"
  },
  "message": "Scan session created successfully"
}
```

### **2. Get Scan Results**
```http
GET /scans/{scan_session_id}/results
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scan_session_id": "uuid",
    "status": "completed",
    "processing_time": 5.2,
    "total_ingredients": 5,
    "safety_summary": {
      "safe": 3,
      "caution": 1,
      "avoid": 1
    },
    "ingredients": [
      {
        "name": "Water",
        "safety_rating": "safe",
        "personalized_rating": "safe",
        "confidence_score": 100,
        "explanation": "Water is essential for life and poses no safety concerns",
        "sources": ["fda", "ewg"],
        "position": 1
      },
      {
        "name": "Sugar",
        "safety_rating": "caution",
        "personalized_rating": "avoid",
        "confidence_score": 90,
        "explanation": "High sugar content may contribute to health issues. Personalized rating adjusted for diabetic diet.",
        "sources": ["ewg"],
        "position": 2
      }
    ]
  },
  "message": "Scan results retrieved successfully"
}
```

### **3. Get Scan History**
```http
GET /scans/history?limit=20&offset=0
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scans": [
      {
        "scan_session_id": "uuid",
        "created_at": "2025-01-27T10:30:00Z",
        "image_url": "https://storage.supabase.co/object/public/images/uuid.jpg",
        "thumbnail_url": "https://storage.supabase.co/object/public/images/uuid_thumb.jpg",
        "total_ingredients": 5,
        "safety_summary": {
          "safe": 3,
          "caution": 1,
          "avoid": 1
        }
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  },
  "message": "Scan history retrieved successfully"
}
```

---

## **Ingredient Database Endpoints**

### **1. Search Ingredients**
```http
GET /ingredients/search?q=sugar&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ingredients": [
      {
        "id": "uuid",
        "name": "Sugar",
        "category": "sweetener",
        "e_number": null,
        "primary_rating": "caution",
        "explanation": "High sugar content may contribute to health issues",
        "sources": ["ewg", "fda"]
      }
    ]
  },
  "message": "Ingredient search completed"
}
```

### **2. Get Ingredient Details**
```http
GET /ingredients/{ingredient_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ingredient": {
      "id": "uuid",
      "name": "Sodium Benzoate",
      "aliases": ["E211", "Benzoate of Soda"],
      "category": "preservative",
      "e_number": "E211",
      "cas_number": "532-32-1",
      "function": "preservative",
      "description": "Sodium benzoate is a preservative used to prevent spoilage",
      "safety_ratings": [
        {
          "source": "fda",
          "rating": "safe",
          "explanation": "Generally recognized as safe (GRAS) by FDA",
          "confidence_score": 85
        },
        {
          "source": "ewg",
          "rating": "caution",
          "explanation": "May cause allergic reactions in sensitive individuals",
          "confidence_score": 75
        }
      ]
    }
  },
  "message": "Ingredient details retrieved successfully"
}
```

---

## **User Profile Endpoints**

### **1. Get User Profile**
```http
GET /profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "avatar_url": "https://storage.supabase.co/object/public/avatars/uuid.jpg",
      "is_premium": false,
      "created_at": "2025-01-01T00:00:00Z"
    },
    "stats": {
      "total_scans": 45,
      "scans_last_30_days": 12,
      "scans_last_7_days": 3
    }
  },
  "message": "Profile retrieved successfully"
}
```

### **2. Update User Profile**
```http
PUT /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Smith",
  "avatar_url": "https://storage.supabase.co/object/public/avatars/new_uuid.jpg"
}
```

### **3. Get Dietary Preferences**
```http
GET /profile/dietary-preferences
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "preferences": [
      {
        "id": "uuid",
        "preference_type": "preset",
        "preference_name": "gluten-free",
        "is_active": true,
        "created_at": "2025-01-01T00:00:00Z"
      },
      {
        "id": "uuid",
        "preference_type": "custom",
        "preference_name": "custom_avoid",
        "custom_ingredients": ["artificial colors", "high fructose corn syrup"],
        "is_active": true,
        "created_at": "2025-01-01T00:00:00Z"
      }
    ]
  },
  "message": "Dietary preferences retrieved successfully"
}
```

### **4. Update Dietary Preferences**
```http
PUT /profile/dietary-preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferences": [
    {
      "preference_type": "preset",
      "preference_name": "gluten-free",
      "is_active": true
    },
    {
      "preference_type": "preset",
      "preference_name": "vegan",
      "is_active": true
    },
    {
      "preference_type": "custom",
      "preference_name": "custom_avoid",
      "custom_ingredients": ["artificial colors", "high fructose corn syrup"],
      "is_active": true
    }
  ]
}
```

---

## **Recommendation Endpoints**

### **1. Get Product Recommendations**
```http
GET /recommendations/products/{scan_session_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "rank": 1,
        "product_name": "Organic Natural Orange Juice",
        "brand": "Simply Orange",
        "description": "100% pure orange juice with no added sugars or preservatives",
        "image_url": "https://example.com/product1.jpg",
        "retailer": "amazon",
        "product_url": "https://amazon.com/product1",
        "price": 4.99,
        "safety_score": 95,
        "recommendation_reason": "Contains only natural ingredients with no artificial additives"
      }
    ]
  },
  "message": "Product recommendations retrieved successfully"
}
```

### **2. Get Recipe Recommendations**
```http
GET /recommendations/recipes/{scan_session_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "recipe_name": "Homemade Natural Orange Drink",
        "description": "Fresh orange juice with natural ingredients",
        "image_url": "https://example.com/recipe1.jpg",
        "prep_time": 10,
        "difficulty_level": "easy",
        "ingredients": ["2 fresh oranges", "1 cup water", "1 tsp honey"],
        "instructions": [
          "Squeeze oranges to extract juice",
          "Mix with water and honey",
          "Serve chilled"
        ],
        "nutrition_info": {
          "calories": 120,
          "sugar": "22g",
          "vitamin_c": "100% DV"
        },
        "source_url": "https://healthyrecipes.com/orange-drink"
      }
    ]
  },
  "message": "Recipe recommendations retrieved successfully"
}
```

---

## **Analytics Endpoints**

### **1. Track User Event**
```http
POST /analytics/track
Authorization: Bearer <token>
Content-Type: application/json

{
  "event_type": "scan_completed",
  "event_data": {
    "scan_session_id": "uuid",
    "total_ingredients": 5,
    "processing_time": 5.2
  }
}
```

### **2. Submit Feedback**
```http
POST /feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "scan_session_id": "uuid",
  "feedback_type": "rating_accuracy",
  "rating": 4,
  "comment": "The safety rating for sugar seemed accurate based on my dietary needs"
}
```

---

## **Admin Endpoints**

### **1. Get System Statistics**
```http
GET /admin/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 1250,
    "active_users_30_days": 890,
    "total_scans": 15420,
    "scans_last_24_hours": 234,
    "average_processing_time": 4.2,
    "popular_ingredients": [
      {"name": "Sugar", "scan_count": 1200},
      {"name": "Sodium Benzoate", "scan_count": 950}
    ]
  },
  "message": "System statistics retrieved successfully"
}
```

### **2. Update Ingredient Safety Rating**
```http
PUT /admin/ingredients/{ingredient_id}/safety-rating
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "rating": "caution",
  "source": "fda",
  "explanation": "Updated based on recent FDA guidance",
  "confidence_score": 90
}
```

---

## **Error Handling**

### **Common HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

### **Error Response Format**
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2025-01-27T10:30:00Z"
}
```

---

## **Rate Limiting**

### **Limits**
- **Anonymous users:** 10 requests per minute
- **Authenticated users:** 100 requests per minute
- **Premium users:** 500 requests per minute
- **Scan processing:** 5 scans per minute per user

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643284800
```

---

## **Webhooks**

### **Scan Completion Webhook**
```json
{
  "event": "scan.completed",
  "data": {
    "scan_session_id": "uuid",
    "user_id": "uuid",
    "total_ingredients": 5,
    "safety_summary": {
      "safe": 3,
      "caution": 1,
      "avoid": 1
    }
  },
  "timestamp": "2025-01-27T10:30:00Z"
}
```

### **User Registration Webhook**
```json
{
  "event": "user.registered",
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "registration_source": "mobile_app"
  },
  "timestamp": "2025-01-27T10:30:00Z"
}
```