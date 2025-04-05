import { z } from 'zod';

// Base product interface
export interface UniformProduct {
    // Required fields
    chainId: string;
    storeId: string;
    itemId: string;
    itemName: string;
    price: number;
    priceUpdateDate: string; // ISO format: "YYYY-MM-DD"

    // Optional fields
    manufacturer?: string;
    manufacturerCountry?: string;
    unitQty?: string;
    quantity?: string;
    unitOfMeasure?: string;
    allowDiscount?: boolean;
    barcodes?: string[];
    status?: string;
}

// Promotion interface extending product
export interface UniformPromo extends UniformProduct {
    // Required promotion fields
    promoPrice: number;
    promoStartDate: string; // ISO format
    promoEndDate: string; // ISO format

    // Optional promotion fields
    promoType?: string;
    promoDescription?: string;
}

// Base product validation schema
export const UniformProductSchema = z.object({
    chainId: z.string().min(1),
    storeId: z.string().min(1),
    itemId: z.string().min(1),
    itemName: z.string().min(1),
    price: z.number().positive(),
    priceUpdateDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

    // Optional fields with validation
    manufacturer: z.string().optional(),
    manufacturerCountry: z.string().optional(),
    unitQty: z.string().optional(),
    quantity: z.string().optional(),
    unitOfMeasure: z.string().optional(),
    allowDiscount: z.boolean().optional(),
    barcodes: z.array(z.string()).optional(),
    status: z.string().optional()
});

// Promotion validation schema
export const UniformPromoSchema = UniformProductSchema.extend({
    // Required promotion fields
    promoPrice: z.number().positive(),
    promoStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    promoEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

    // Optional promotion fields
    promoType: z.string().optional(),
    promoDescription: z.string().optional()
});

// Normalization maps
export const NormalizationMaps = {
    unitOfMeasure: new Map([
        ['L', 'ליטר'],
        ['KG', 'ק״ג'],
        ['ML', 'מ״ל'],
        ['UNIT', 'יחידה'],
        ['PACK', 'חבילה']
    ]),
    manufacturer: new Map([
        ['TNUVA', 'תנובה'],
        ['TARA', 'טרה'],
        ['STRAUSS', 'שטראוס'],
        ['OSEM', 'אסם']
    ]),
    // city mappings are handled by each chain's normalizer
};

// Normalization functions
export const NormalizationFunctions = {
    normalizeDate: (dateStr: string): string => {
        if (dateStr.length === 12) { // Format: YYYYMMDDHHMM
            return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
        }
        return dateStr;
    },

    normalizePrice: (price: string | number): number => {
        if (typeof price === 'string') {
            return parseFloat(price.replace(/[^0-9.]/g, ''));
        }
        return price;
    },

    normalizeUnitOfMeasure: (unit: string): string => {
        return NormalizationMaps.unitOfMeasure.get(unit.toUpperCase()) || unit;
    },

    normalizeManufacturer: (manufacturer: string): string => {
        return NormalizationMaps.manufacturer.get(manufacturer.toUpperCase()) || manufacturer;
    },

}; 
