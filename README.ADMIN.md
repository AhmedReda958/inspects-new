# Admin Panel User Guide

## Access

Admin panel is available at: `/admin`

Default credentials (⚠️ **Change immediately after first login!**):
- Email: `admin@inspectex.com`
- Password: `admin123`

## Dashboard Overview

The dashboard provides:
- Total leads count
- New leads requiring attention
- Total revenue from calculations
- Active packages count
- Quick access links to all management sections

## Lead Management

### Viewing Leads

Navigate to **Leads Management** to view all calculator submissions.

**Filter by Status:**
- **New** - Just submitted, needs review
- **Contacted** - Initial contact made
- **Qualified** - Potential customer
- **Converted** - Became a customer
- **Rejected** - Not interested

**Lead Information Includes:**
- Customer name and contact details
- Property location (city, neighborhood)
- Selected package
- Calculated price and breakdown
- Submission date

### Managing Leads

Click "View" on any lead to:
1. See full calculation breakdown
2. Update lead status
3. Add notes
4. Assign to team member
5. Set follow-up date

## Package Management

### Managing Packages

Navigate to **Manage Packages** to:
- View all packages (Basic, Premium, VIP)
- Edit package details:
  - Arabic name
  - Description
  - Base price (for properties ≤ 250m²)
  - Display order
  - Active/inactive status

### Area Price Tiers

Each package has pricing tiers for areas > 250m²:

**Example for Premium Package:**
- 251-500m²: 25 SAR/m²
- 501-1000m²: 22 SAR/m²
- 1001m²+: 20 SAR/m²

**Important:** Basic package uses fixed 4 SAR/m² for all excess area.

## Location Management

### Cities

Add and manage cities:
1. Arabic name (e.g., "الرياض")
2. English name (optional)
3. Display order
4. Active status

### Neighborhoods

For each city, add neighborhoods with:
- **Name:** Neighborhood name in Arabic
- **Level:** A, B, C, or D (quality tier)
- **Multiplier:** Price adjustment factor
  - Level A (Premium): 1.15 (15% increase)
  - Level B (Above avg): 1.10 (10% increase)
  - Level C (Average): 1.00 (no change)
  - Level D (Below avg): 0.95 (5% decrease)
- **Apply Above Area:** Minimum area for multiplier (default 500m²)

**Example:**
```
City: الرياض
Neighborhood: الملقا
Level: A
Multiplier: 1.15
Apply Above Area: 500
```

This adds 15% to properties > 500m² in Al Malqa.

## Multiplier Configuration

### Property Age Multipliers

Configure price adjustments based on property age:

| Age Range | Multiplier | Effect |
|-----------|------------|--------|
| أقل من سنة | 0.95 | -5% (newer, less issues) |
| من 1 إلى 3 سنوات | 1.00 | No change |
| من 3 إلى 5 سنوات | 1.05 | +5% |
| من 5 إلى 10 سنوات | 1.10 | +10% |
| أكثر من 10 سنوات | 1.15 | +15% (older, more issues) |

### Inspection Purpose Multipliers

Configure adjustments based on inspection reason:

| Purpose | Multiplier | Effect |
|---------|------------|--------|
| قبل الشراء | 1.00 | Standard price |
| قبل البيع | 0.95 | -5% discount |
| صيانة دورية | 0.90 | -10% discount |
| تقييم عقاري | 1.05 | +5% premium |
| فحص ما بعد البناء | 1.10 | +10% premium |

## Settings

### VAT Configuration

Update VAT percentage (currently 15%):
1. Navigate to Settings
2. Enter new VAT percentage
3. Save changes

**Note:** New VAT applies to all future calculations immediately.

### Calculation Rules

Configure global calculation parameters:

| Rule | Default | Description |
|------|---------|-------------|
| base_area_threshold | 250 | Area limit for fixed pricing (m²) |
| neighborhood_multiplier_threshold | 500 | Min area for neighborhood adjustment (m²) |
| roofed_area_calculation_factor | 0.6 | Factor for estimating roofed area |

## Understanding the Calculation

### Step-by-Step Breakdown

**Example:** 400m² property in الملقا, Riyadh

1. **Base Calculation**
   - Package: Premium
   - Area: 400m² (exceeds 250m² threshold)
   - Tier: 251-500m² = 25 SAR/m²
   - Base price = 400 × 25 = **10,000 SAR**

2. **Age Adjustment**
   - Age: 3-5 years → multiplier 1.05
   - Price = 10,000 × 1.05 = **10,500 SAR**

3. **Purpose Adjustment**
   - Purpose: Before purchase → multiplier 1.00
   - Price = 10,500 × 1.00 = **10,500 SAR**

4. **Neighborhood Adjustment** (if area > 500m²)
   - Not applied (400m² < 500m² threshold)
   - Price = **10,500 SAR**

5. **VAT**
   - VAT (15%) = 10,500 × 0.15 = 1,575 SAR
   - **Final Price = 12,075 SAR**

## Best Practices

### Data Management

1. **Regular Backups**
   - Database is backed up daily
   - Can request manual backup anytime

2. **Audit Trail**
   - All changes are logged
   - View audit logs for accountability

3. **Testing Changes**
   - Test price changes with calculator before confirming
   - Use test leads to verify calculations

### Lead Follow-up

1. **Prioritize New Leads**
   - Review new leads within 24 hours
   - Move to "Contacted" after first call

2. **Use Notes Effectively**
   - Record customer preferences
   - Note concerns or special requests
   - Track communication history

3. **Follow-up Dates**
   - Set reminders for callbacks
   - Track conversion pipeline

### Configuration Changes

1. **Price Adjustments**
   - Announce price changes in advance
   - Update website content accordingly
   - Monitor impact on conversion rates

2. **Location Updates**
   - Add new neighborhoods as needed
   - Adjust multipliers based on market data
   - Keep city list current

3. **Multiplier Tuning**
   - Review multipliers quarterly
   - Adjust based on actual inspection costs
   - Consider seasonal factors

## Troubleshooting

### Common Issues

**Can't login:**
- Verify email and password
- Check if account is active
- Contact super admin

**Prices seem incorrect:**
- Review calculation breakdown in lead details
- Verify multiplier values
- Check VAT percentage

**Missing options in calculator:**
- Ensure items are marked "Active"
- Check display order
- Clear browser cache

### Getting Help

For technical support:
1. Check server logs
2. Review audit logs for recent changes
3. Contact system administrator

## Security

### Password Policy

- Minimum 8 characters
- Change every 90 days recommended
- Don't share credentials

### Access Control

- Use role-based permissions
- Limit admin accounts
- Monitor audit logs

### Data Privacy

- Customer data is confidential
- Follow GDPR/local regulations
- Secure export processes

