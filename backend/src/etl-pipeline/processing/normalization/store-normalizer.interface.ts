import { UniformItem, UniformStore } from '../../schemas/uniform/index.js';
import { RawFileContent } from '../../data-access.service.js';

/**
 * Interface for store data normalizers
 * Each supermarket chain should implement this interface
 */
export interface StoreNormalizer {
    /**
     * Normalize store data from a specific supermarket chain to a uniform format
     * @param storeData The raw store data from the supermarket chain
     * @returns Normalized store data in the uniform format
     */
    normalizeStoreData(storeData: RawFileContent[]): UniformStore[];

    /**
     * Validate that a store object conforms to the uniform format
     * @param store The store object to validate
     * @returns Whether the store object is valid
     */
    validateStore(store: UniformStore): boolean;
}

export interface ItemNormalizer {
    normalizeItemData(itemData: RawFileContent[]): UniformItem[];
    validateItem(item: UniformItem): boolean;
}
