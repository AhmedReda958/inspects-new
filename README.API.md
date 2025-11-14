# API Documentation

## Authentication

All admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

Or use cookies (automatically set after login).

## Public Endpoints

### Calculate Price

**POST** `/api/calculate-price`

Calculate inspection cost and save submission.

**Request Body:**
```json
{
  "firstName": "محمد",
  "familyName": "أحمد",
  "mobileNumber": "0501234567",
  "email": "example@email.com",
  "package": "premium",
  "inspectionPurpose": "قبل الشراء",
  "city": "الرياض",
  "neighborhood": "الملقا",
  "propertyAge": "من 1 إلى 3 سنوات",
  "landArea": "400",
  "coveredArea": "300"
}
```

**Response:**
```json
{
  "success": true,
  "price": 9200,
  "basePrice": 8000,
  "priceBeforeVat": 8000,
  "vatAmount": 1200,
  "breakdown": {
    "step1_baseCalculation": { ... },
    "step2_ageMultiplier": { ... },
    "step3_purposeMultiplier": { ... },
    "step4_neighborhoodMultiplier": { ... },
    "step5_vat": { ... }
  }
}
```

### Get Calculator Configuration

**GET** `/api/calculator/config`

Get all available options for calculator dropdown fields.

**Response:**
```json
{
  "success": true,
  "data": {
    "packages": [
      { "value": "basic", "label": "الباقة الأساسية" }
    ],
    "cities": [
      { "value": "الرياض", "label": "الرياض" }
    ],
    "cityNeighborhoods": {
      "الرياض": ["الملقا", "الروضة", ...]
    },
    "propertyAges": [...],
    "inspectionPurposes": [...]
  }
}
```

## Admin Authentication

### Login

**POST** `/api/admin/auth/login`

Authenticate admin user.

**Request Body:**
```json
{
  "email": "admin@inspectex.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@inspectex.com",
    "name": "Admin User",
    "role": "superadmin"
  },
  "token": "eyJhbGc..."
}
```

### Logout

**POST** `/api/admin/auth/logout`

Logout current user (clears cookies).

### Get Current User

**GET** `/api/admin/auth/me`

Get currently authenticated user information.

## Admin CRUD Endpoints

### Packages

- **GET** `/api/admin/packages` - List all packages
- **POST** `/api/admin/packages` - Create new package
- **GET** `/api/admin/packages/:id` - Get single package
- **PUT** `/api/admin/packages/:id` - Update package
- **DELETE** `/api/admin/packages/:id` - Soft delete package

### Cities

- **GET** `/api/admin/cities` - List all cities
- **POST** `/api/admin/cities` - Create new city
- **GET** `/api/admin/cities/:id` - Get single city
- **PUT** `/api/admin/cities/:id` - Update city
- **DELETE** `/api/admin/cities/:id` - Soft delete city

### Neighborhoods

- **GET** `/api/admin/neighborhoods?cityId=...` - List neighborhoods (optional city filter)
- **POST** `/api/admin/neighborhoods` - Create new neighborhood
- **PUT** `/api/admin/neighborhoods/:id` - Update neighborhood
- **DELETE** `/api/admin/neighborhoods/:id` - Soft delete neighborhood

**Neighborhood Schema:**
```json
{
  "cityId": "city-id",
  "name": "الملقا",
  "nameEn": "Al Malqa",
  "level": "A",
  "multiplier": 1.15,
  "applyAboveArea": 500,
  "displayOrder": 0
}
```

### Property Age Multipliers

- **GET** `/api/admin/property-age-multipliers` - List all age multipliers
- **POST** `/api/admin/property-age-multipliers` - Create new multiplier
- **PUT** `/api/admin/property-age-multipliers/:id` - Update multiplier
- **DELETE** `/api/admin/property-age-multipliers/:id` - Soft delete multiplier

### Inspection Purpose Multipliers

- **GET** `/api/admin/inspection-purpose-multipliers` - List all purpose multipliers
- **POST** `/api/admin/inspection-purpose-multipliers` - Create new multiplier
- **PUT** `/api/admin/inspection-purpose-multipliers/:id` - Update multiplier
- **DELETE** `/api/admin/inspection-purpose-multipliers/:id` - Soft delete multiplier

### Leads

- **GET** `/api/admin/leads?status=...&page=1&limit=50` - List all calculator submissions
- **GET** `/api/admin/leads/:id` - Get single lead with details
- **PUT** `/api/admin/leads/:id` - Update lead status/notes

**Update Lead Schema:**
```json
{
  "status": "contacted",
  "notes": "Customer interested in premium package",
  "assignedTo": "user-id",
  "followUpDate": "2024-01-15T10:00:00Z"
}
```

### Settings

#### VAT Settings

- **GET** `/api/admin/settings/vat` - Get current VAT percentage
- **PUT** `/api/admin/settings/vat` - Update VAT percentage

```json
{
  "percentage": 15
}
```

#### Calculation Rules

- **GET** `/api/admin/settings/calculation-rules` - Get all calculation rules
- **PUT** `/api/admin/settings/calculation-rules` - Update multiple rules

```json
[
  {
    "id": "rule-id",
    "value": "250"
  }
]
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message in Arabic or English",
  "details": [] // Optional validation errors
}
```

**Common Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Calculation Formula

The price is calculated as follows:

1. **Base Price** (Step 1):
   - If covered area ≤ 250m²: Use package base price
   - If covered area > 250m²:
     - Basic: base price + (excess area × 4 SAR)
     - Premium/VIP: total area × tier price per sqm

2. **Apply Age Multiplier** (Step 2):
   - Price × age multiplier (0.95 to 1.15)

3. **Apply Purpose Multiplier** (Step 3):
   - Price × purpose multiplier (0.9 to 1.1)

4. **Apply Neighborhood Multiplier** (Step 4):
   - Only if covered area > 500m²
   - Price × neighborhood multiplier (0.95 to 1.15)

5. **Add VAT** (Step 5):
   - Final price = price before VAT × (1 + VAT%)

## Audit Logging

All admin actions are logged in the `audit_logs` table with:
- User ID
- Action type (CREATE, UPDATE, DELETE)
- Table name
- Old and new values
- IP address and user agent
- Timestamp

