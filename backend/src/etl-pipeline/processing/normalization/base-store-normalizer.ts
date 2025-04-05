import { Logger } from '@nestjs/common';
import { UniformStore, UniformStoreSchema, UniformItem } from '../../schemas/uniform/index.js';
import { StoreNormalizer, Normalizer } from './store-normalizer.interface.js';
import { RawFileContent } from '../../data-access.service.js';
import { NormalizationFunctions } from './uniform-format.js';

/**
 * Abstract base class for store normalizers
 * Provides common functionality for all store normalizers
 */
export abstract class BaseStoreNormalizer implements StoreNormalizer, Normalizer<UniformItem | UniformStore> {
    protected readonly logger = new Logger(this.constructor.name);

    /**
     * Normalize raw data to the target format
     * @param data The raw data to normalize
     * @returns Normalized data in the target format
     */
    normalize(data: RawFileContent[]): (UniformItem | UniformStore)[] {
        return this.normalizeStoreData(data);
    }

    /**
     * Normalize store data from a specific supermarket chain to a uniform format
     * To be implemented by specific chain normalizers
     */
    abstract normalizeStoreData(storeData: RawFileContent[]): UniformStore[];

    /**
     * Validate that a store object conforms to the uniform format
     * @param store The store object to validate
     * @returns Whether the store object is valid
     */
    validateStore(store: UniformStore): boolean {
        try {
            UniformStoreSchema.parse(store);
            return true;
        } catch (error) {
            this.logger.error(`Store validation error: ${error.message}`);
            return false;
        }
    }

    /**
     * Normalize a city code to a city name
     * @param cityCode The city code to normalize
     * @returns The normalized city name
     */
    protected normalizeCity(cityCode: string): string {
        return NormalizationFunctions.normalizeCity(cityCode);
    }

    /**
     * Create a UniformStore object and validate it
     * @param store The store data to normalize
     * @returns A validated UniformStore object
     * @throws Error if validation fails
     */
    protected createAndValidateStore(store: UniformStore): UniformStore {
        if (!this.validateStore(store)) {
            throw new Error(`Store failed validation: ${JSON.stringify(store)}`);
        }
        return store;
    }
} 
