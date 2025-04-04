# Supermarket Chain Schemas

## TIV_TAAM Schema

```json
{
  "store": {
    "chainid": "string",        // e.g., "7290873255550"
    "chainname": "string",      // e.g., "טיב טעם"
    "lastupdatedate": "string", // e.g., "2025-04-04"
    "lastupdatetime": "string", // e.g., "01:10:00"
    "subchainid": "string",     // e.g., "1"
    "subchainname": "string",   // e.g., "1"
    "storeid": "string",        // e.g., "6"
    "bikoretno": "string",      // e.g., "1"
    "storetype": "string",      // e.g., "1"
    "storename": "string",      // e.g., "בת ים"
    "address": "string",        // e.g., "אהוד קינמון 14"
    "city": "string",           // e.g., "בת ים"
    "zipcode": "string"         // e.g., "5959401"
  }
}
```

## VICTORY Schema

```json
{
  "store": {
    "chainid": "string",        // e.g., "7290696200003"
    "chainname": "string",      // e.g., "ויקטורי"
    "lastupdatedate": "string", // e.g., "2025-04-04"
    "lastupdatetime": "string", // e.g., "06:00:00"
    "subchainid": "string",     // e.g., "1"
    "subchainname": "string",   // e.g., "1"
    "storeid": "string",        // e.g., "1"
    "bikoretno": "string",      // e.g., "1"
    "storetype": "string",      // e.g., "1"
    "storename": "string",      // e.g., "סיטי אחד העם"
    "address": "string",        // e.g., "אחד העם 54"
    "city": "string",           // e.g., "תל-אביב"
    "zipcode": "string"         // e.g., "unknown"
  }
}
```

## YOHANANOF Schema

```json
{
  "store": {
    "chainid": "string",        // e.g., "7290803800003"
    "chainname": "string",      // e.g., "מ. יוחננוף ובניו"
    "lastupdatedate": "string", // e.g., "2025-04-04"
    "lastupdatetime": "string", // e.g., "01:00:00"
    "subchainid": "string",     // e.g., "1"
    "subchainname": "string",   // e.g., "1"
    "storeid": "string",        // e.g., "1"
    "bikoretno": "string",      // e.g., "6"
    "storetype": "string",      // e.g., "1" or "2"
    "storename": "string",      // e.g., "יוחננוף מפוח"
    "address": "string",        // e.g., "רחוב המפוח 11, אזור התעשיה"
    "city": "string",           // e.g., "רחובות"
    "zipcode": "string"         // e.g., "unknown"
  }
}
```

## Common Schema Elements

All three chains share the same basic structure with the following fields:

1. **chainid**: Unique identifier for the supermarket chain
2. **chainname**: Name of the supermarket chain
3. **lastupdatedate**: Date of the last update (YYYY-MM-DD format)
4. **lastupdatetime**: Time of the last update (HH:MM:SS format)
5. **subchainid**: Identifier for the subchain (all currently use "1")
6. **subchainname**: Name of the subchain (all currently use "1")
7. **storeid**: Unique identifier for the store
8. **bikoretno**: A single-digit number (0-9) with unclear meaning
9. **storetype**: Store type identifier (mostly "1", some exceptions)
10. **storename**: Name of the store
11. **address**: Physical address of the store
12. **city**: City where the store is located
13. **zipcode**: Postal code of the store location

## Data Quality Notes

1. **TIV_TAAM**:
   - Has valid zip codes
   - Complete address information
   - Consistent store type values

2. **VICTORY**:
   - Missing zip codes (marked as "unknown")
   - Complete address and city information
   - Consistent store type values

3. **YOHANANOF**:
   - Missing zip codes (marked as "unknown")
   - Many missing addresses and cities
   - One store with different store type (storetype: "2") 
