import { Injectable, Logger } from '@nestjs/common';
import { RawFileContent } from '../data-access.service.js';
import { ShufersalProduct, ShufersalStore, ShufersalProductSchema, ShufersalStoreSchema } from '../schemas/chains/shufersal/index.js';
import { Transformer } from './transformer.js';
import { UniformItem } from '../schemas/uniform/index.js';
import { UniformStore } from '../schemas/uniform/index.js';

/**
 * Service that transforms raw Shufersal data into structured formats.
 */
@Injectable()
export class ShufersalTransformerService implements Transformer {
    transformProductData(productData: RawFileContent[]): UniformItem[] {
        if (!productData || !Array.isArray(productData) || productData.length === 0) {
            this.logger.warn('No product data to transform');
            return [];
        }

        // First parse the raw data into ShufersalProduct objects
        const products = this.transformItems(productData, (row) => ShufersalProductSchema.parse(row));

        // Then map to the standard format
        const uniformProducts = products.map(product => this.uniformMapProduct(product));

        return uniformProducts;
    }

    /**
     * Maps a ShufersalProduct to the uniform product format
     * @param product The ShufersalProduct to map
     * @returns UniformItem with standardized fields
     */
    uniformMapProduct(product: ShufersalProduct): UniformItem {
        return {
            chainId: product.row_content.chainid,
            storeId: product.row_content.storeid,
            itemCode: product.row_content.itemcode,
            itemName: product.row_content.itemname,
            manufacturerName: product.row_content.manufacturername,
            manufactureCountry: product.row_content.manufacturecountry,
            itemPrice: parseFloat(product.row_content.itemprice),
            itemQuantity: parseFloat(product.row_content.quantity),
            itemUnitOfMeasure: product.row_content.unitofmeasure,
            itemUnitOfMeasurePrice: parseFloat(product.row_content.unitofmeasureprice),
            itemStatus: product.row_content.itemstatus,
            updateDate: product.row_content.priceupdatedate,
        };
    }

    private readonly logger = new Logger(ShufersalTransformerService.name);

    /**
     * Generic method to transform any type of item data into structured objects
     * This provides flexibility for different file types and use cases
     * 
     * @param itemData Raw item data from the API
     * @param mapFunction Optional custom mapping function
     * @returns Array of transformed items
     */
    transformItems<T extends ShufersalProduct | ShufersalStore>(
        itemData: RawFileContent[],
        mapFunction: (row: RawFileContent) => T
    ): T[] {
        if (!itemData || !Array.isArray(itemData) || itemData.length === 0) {
            this.logger.warn('No item data to transform');
            return [];
        }

        this.logger.log(`Transforming ${itemData.length} generic item rows`);

        const items: T[] = [];

        for (const row of itemData) {
            try {
                // Use custom mapping function if provided
                const item = mapFunction(row);
                items.push(item);
            } catch (error) {
                this.logger.error(`Error transforming item row: ${error.message}`, error.stack);
                // Continue with next row
            }
        }

        this.logger.log(`Successfully transformed ${items.length} items`);
        return items;
    }

    toUniformStore(store: ShufersalStore): UniformStore {
        return {
            chainId: store.row_content.chainid,
            storeId: store.row_content.storeid,
            name: store.row_content.storename,
            address: store.row_content.address,
            city: store.row_content.city,
            zipCode: store.row_content.zipcode,
        }
    }

    transformStoreData(storeData: RawFileContent[]): UniformStore[] {
        if (!storeData || !Array.isArray(storeData) || storeData.length === 0) {
            this.logger.warn('No store data to transform');
            return [];
        }

        const stores = this.transformItems(storeData, (row) => ShufersalStoreSchema.parse(row));

        // Map to the uniform store format
        return stores.map(store => this.toUniformStore(store));
    }
}
