# Data Quality Issues and Recommendations for Rami Levy

## City Codes
Rami Levy uses numeric codes for cities:
- 5000: Tel Aviv
- 5100: Jerusalem
- 5200: Haifa
- 5300: Be'er Sheva
- 5400: Netanya
- 5500: Ashdod
- 5600: Rishon LeZion
- 5700: Petah Tikva
- 5800: Holon
- 5900: Bnei Brak

## Chain-Specific Mappings and Formats

### Chain ID
The correct chain ID is 7290058140886.

### File Naming Conventions
- Price files: `PriceFull{chainid}-{storeid}-{timestamp}.xml`
- Promo files: `Promo{chainid}-{storeid}-{timestamp}.xml`
- Store files: `StoresFull{chainid}-{timestamp}.xml`

### Field Names
- Uses `itemnm` instead of `itemname`
- Uses numeric city codes instead of city names
- Uses `manufacturecountry` instead of `manufacturercountry`
- Uses `manufactureritemdescription` instead of `itemdescription`
