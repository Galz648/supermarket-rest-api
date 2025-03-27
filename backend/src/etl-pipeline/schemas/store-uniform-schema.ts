import { z } from 'zod';

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
    // TODO: city can be represented as a number wrapped by string, this needs to be normalized (possibly looking for the city name in other means (zip code))
    city: z.string(),
    zipCode: z.string(),
    subChainId: z.string(),
    subChainName: z.string(),
    storeType: z.string().optional(),
});

export type UniformStore = z.infer<typeof UniformStoreSchema>;
