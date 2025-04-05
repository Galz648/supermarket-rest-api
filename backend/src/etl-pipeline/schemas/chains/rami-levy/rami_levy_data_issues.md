# RAMI LEVY Data Quality Issues

This document tracks data quality issues found in RAMI LEVY's data feed.

## Store Data Issues

### 1. City Codes
- **Issue**: Many stores use numeric city codes instead of city names
- **Example**: "2640", "4000", "7400"
- **Impact**: Cannot directly identify city names without a mapping table
- **Status**: Needs mapping table implementation

### 2. Invalid Zip Codes
- **Issue**: Some stores have "0000000" as zip code
- **Affected Stores**:
  - Store ID: 030 (קדימה)
  - Store ID: 046 (רעננה)
  - Store ID: 053 (אריאל)
  - Store ID: 055 (רמת החייל)
  - Store ID: 061 (כרמי גת)
  - Store ID: 066 (מגדל העמק)
- **Impact**: Cannot use zip codes for location-based services
- **Status**: Need to verify correct zip codes

### 3. Empty Addresses
- **Issue**: Some stores have empty addresses marked as "{}"
- **Affected Stores**:
  - Store ID: 046 (רעננה)
  - Store ID: 055 (רמת החייל)
  - Store ID: 057 (עזריאלי חיפה)
- **Impact**: Missing location information
- **Status**: Need to collect correct addresses

### 4. Duplicate Store Numbers
- **Issue**: Multiple stores share the same `bikoretno`
- **Example**: Multiple stores have `bikoretno=7`
- **Impact**: Cannot use `bikoretno` as unique identifier
- **Status**: Need to verify if this is intentional

## Promotion Data Issues

### 1. Invalid Dates
- **Issue**: Some promotions show "1899-12-30 00:00" as update date
- **Impact**: Cannot track when promotions were last updated
- **Status**: Need to verify correct update dates

### 2. Unclear Numeric Values
- **Issue**: Several numeric fields lack clear meaning
- **Affected Fields**:
  - `weightunit=1`
  - `discounttype=0`
  - `discountrate=10000`
  - `rewardtype` values (1, 6)
  - `itemtype=1`
- **Impact**: Cannot interpret these values without documentation
- **Status**: Need documentation from RAMI LEVY

### 3. JSON String Encoding
- **Issue**: `additionalrestrictions` and `remarks` contain Hebrew text in JSON strings
- **Impact**: Potential encoding issues when parsing
- **Status**: Need to verify proper encoding handling

## Recommendations

1. Create a city code mapping table
2. Collect correct zip codes and addresses for affected stores
3. Request documentation for unclear numeric values
4. Implement proper encoding handling for Hebrew text
5. Verify if duplicate store numbers are intentional
6. Request clarification on invalid dates in promotion data

## Last Updated
- Date: 2024-04-04
- Data Source: RAMI LEVY API
- File Version: 1.0 
