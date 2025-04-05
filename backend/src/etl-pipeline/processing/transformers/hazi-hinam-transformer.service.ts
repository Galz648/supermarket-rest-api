import { Injectable, Logger } from '@nestjs/common';
import { Transformer } from './transformer.js';
import { RawFileContent } from '../../data-access.service.js';
import { UniformItem, UniformStore } from '../../schemas/uniform/index.js';
import { HaziHinamProduct, HaziHinamStore, HaziHinamProductSchema, HaziHinamStoreSchema } from '../../schemas/chains/hazi-hinam/index.js';

/**
 * Service that transforms raw Hazi-Hinam data into structured formats.
 */
@Injectable()
export class HaziHinamTransformerService implements Transformer {
    private readonly logger = new Logger(HaziHinamTransformerService.name);

    transformProductData(productData: RawFileContent[]): UniformItem[] {
        if (!productData || !Array.isArray(productData) || productData.length === 0) {
            this.logger.warn('No product data to transform');
            return [];
        }

        // TODO: determine if safeParse is more suitable
        const products = this.transformItems(productData, (row) => HaziHinamProductSchema.parse(row));

        // Map to the uniform product format
        return products.map(product => this.uniformMapProduct(product));
    }

    transformStoreData(storeData: RawFileContent[]): UniformStore[] {
        if (!storeData || !Array.isArray(storeData) || storeData.length === 0) {
            this.logger.warn('No store data to transform');
            return [];
        }

        // TODO: determine if safeParse is more suitable
        const stores = this.transformItems(storeData, (row) => HaziHinamStoreSchema.parse(row));

        // Map to the uniform store format
        return stores.map(store => this.toUniformStore(store));
    }

    /**
     * Maps a HaziHinamProduct to the uniform product format
     * @param product The HaziHinamProduct to map
     * @returns UniformItem with standardized fields
     */
    uniformMapProduct(product: HaziHinamProduct): UniformItem {
        // Safe conversion to make sure we handle both string and number values
        const getNumberValue = (value: string | number): number => {
            return typeof value === 'string' ? parseFloat(value) : value;
        };

        return {
            chainId: product.row_content.chainid,
            storeId: product.row_content.storeid,
            itemCode: product.row_content.itemcode,
            itemName: product.row_content.itemname,
            manufacturerName: product.row_content.manufacturename,
            manufactureCountry: product.row_content.manufacturecountry,
            itemPrice: getNumberValue(product.row_content.itemprice),
            itemQuantity: getNumberValue(product.row_content.quantity),
            itemUnitOfMeasure: product.row_content.unitofmeasure,
            itemUnitOfMeasurePrice: getNumberValue(product.row_content.unitofmeasureprice),
            itemStatus: product.row_content.itemstatus,
            updateDate: product.row_content.priceupdatetime,
        };
    }

    /**
     * Generic method to transform any type of item data into structured objects
     * 
     * @param itemData Raw item data from the API
     * @param mapFunction Optional custom mapping function
     * @returns Array of transformed items
     */
    transformItems<T extends HaziHinamProduct | HaziHinamStore>(
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

    /**
     * Maps a HaziHinamStore to the uniform store format
     * @param store The HaziHinamStore to map
     * @returns UniformStore with standardized fields
     */
    toUniformStore(store: HaziHinamStore): UniformStore {
        return {
            chainId: store.row_content.chainid,
            storeId: store.row_content.storeid,
            name: store.row_content.storename,
            address: store.row_content.address,
            city: store.row_content.city,
            zipCode: store.row_content.zipcode,
        }
    }
} 
