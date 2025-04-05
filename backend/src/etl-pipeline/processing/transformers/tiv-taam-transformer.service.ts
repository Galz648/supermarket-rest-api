import { Injectable, Logger } from '@nestjs/common';
import { RawFileContent } from '../../data-access.service.js';
import { TivTaamProduct, TivTaamProductSchema, TivTaamStore, tivTaamStoreSchema } from '../../schemas/chains/tiv-taam/index.js';
import { Transformer } from './transformer.js';
import { UniformItem, UniformStore } from '../../schemas/uniform/index.js';

/**
 * Service that transforms raw Tiv Taam data into structured formats.
 */
@Injectable()
export class TivTaamTransformerService implements Transformer {
    private readonly logger = new Logger(TivTaamTransformerService.name);

    transformProductData(productData: RawFileContent[]): UniformItem[] {
        if (!productData || !Array.isArray(productData) || productData.length === 0) {
            this.logger.warn('No product data to transform');
            return [];
        }

        // First parse the raw data into TivTaamProduct objects
        const products = this.transformItems(productData, (row) => TivTaamProductSchema.parse(row));

        // Then map to the standard format
        const uniformProducts = products.map(product => this.uniformMapProduct(product));

        return uniformProducts;
    }

    /**
     * Maps a TivTaamProduct to the uniform product format
     * @param product The TivTaamProduct to map
     * @returns UniformItem with standardized fields
     */
    uniformMapProduct(product: TivTaamProduct): UniformItem {
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

    /**
     * Generic method to transform any type of item data into structured objects
     */
    transformItems<T extends TivTaamProduct | TivTaamStore>(
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
     * Maps a TivTaamStore to the uniform store format
     * @param store The TivTaamStore to map
     * @returns UniformStore with standardized fields
     */
    toUniformStore(store: TivTaamStore): UniformStore {
        return {
            chainId: store.store.chainid,
            storeId: store.store.storeid,
            name: store.store.storename,
            address: store.store.address,
            city: store.store.city,
            zipCode: store.store.zipcode,
        }
    }

    transformStoreData(storeData: RawFileContent[]): UniformStore[] {
        if (!storeData || !Array.isArray(storeData) || storeData.length === 0) {
            this.logger.warn('No store data to transform');
            return [];
        }

        const stores = this.transformItems(storeData, (row) => tivTaamStoreSchema.parse(row));

        // Map to the uniform store format
        return stores.map(store => this.toUniformStore(store));
    }
} 
