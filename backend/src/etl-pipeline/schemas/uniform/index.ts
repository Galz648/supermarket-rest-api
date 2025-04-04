import { z } from 'zod';

/**
 * Uniform schema for item data across all supermarket chains
 * This schema represents the standardized format for item information
 * that will be used throughout the application
 */
export const UniformItemSchema = z.object({
    chainId: z.string(),
    storeId: z.string(),
    itemCode: z.string(), // should be the barcode that uniquely identifies the product
    itemName: z.string(),
    manufacturerName: z.string(),
    manufactureCountry: z.string(),
    itemPrice: z.number(),
    itemStatus: z.string(),
    itemQuantity: z.number(),
    itemUnitOfMeasure: z.string(),
    itemUnitOfMeasurePrice: z.number(),
    updateDate: z.string(),
});

/**
 * Uniform schema for store data across all supermarket chains
 * This schema represents the standardized format for store information
 * that will be used throughout the application
 */
export const UniformStoreSchema = z.object({
    chainId: z.string(),
    storeId: z.string(),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    zipCode: z.string(),
});

// Type inference
export type UniformItem = z.infer<typeof UniformItemSchema>;
export type UniformStore = z.infer<typeof UniformStoreSchema>; 
