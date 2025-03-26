import { Injectable, Logger } from '@nestjs/common';
import { RawFileContent } from '../data-access.service.js';
import { ShufersalItemSchema } from '../schemas/shufersal-schema.js';

/**
 * Defines the structure of transformed Shufersal items
 */
export interface TransformedShufersalItem {
    chainid: string;
    storeid: string;
    itemcode: string;
    itemname: string;
    itemprice: number | null;
    rawItem: Record<string, string | number>;
}

/**
 * Service that transforms raw Shufersal data into structured formats.
 * This includes functionality for prices, promotions, and store information.
 */
@Injectable()
export class ShufersalTransformerService {
    private readonly logger = new Logger(ShufersalTransformerService.name);

    /**
     * Transform price data into structured format
     * @param priceData Raw price data from the API
     * @returns Transformed price items
     */
    transformPriceData(priceData: RawFileContent[]): TransformedShufersalItem[] {
        if (!priceData || !Array.isArray(priceData) || priceData.length === 0) {
            this.logger.warn('No price data to transform');
            return [];
        }

        this.logger.log(`Transforming ${priceData.length} price data rows`);

        const transformedItems: TransformedShufersalItem[] = [];

        for (const row of priceData) {
            try {
                // Validate the row against our schema
                const validRow = ShufersalItemSchema.parse(row);

                // Map the valid row to our output format
                const item = this.mapPriceItemToOutputFormat(validRow);
                transformedItems.push(item);
            } catch (error) {
                this.logger.error(`Error transforming price row: ${error.message}`, error.stack);
                // Continue with next row
            }
        }

        this.logger.log(`Successfully transformed ${transformedItems.length} price items`);
        return transformedItems;
    }

    /**
     * Generic method to transform any type of item data into structured objects
     * This provides flexibility for different file types and use cases
     * 
     * @param itemData Raw item data from the API
     * @param mapFunction Optional custom mapping function
     * @returns Array of transformed items
     */
    transformItems<T = TransformedShufersalItem>(
        itemData: RawFileContent[],
        mapFunction?: (row: RawFileContent) => T
    ): T[] {
        if (!itemData || !Array.isArray(itemData) || itemData.length === 0) {
            this.logger.warn('No item data to transform');
            return [];
        }

        this.logger.log(`Transforming ${itemData.length} generic item rows`);

        const items: T[] = [];

        for (const row of itemData) {
            try {
                // Use custom mapping function if provided, otherwise default to price mapping
                const item = mapFunction
                    ? mapFunction(row)
                    : this.mapPriceItemToOutputFormat(row) as unknown as T;

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
     * Transform promotion data into structured format
     * @param promoData Raw promotion data from the API
     * @returns Transformed promotion items
     */
    transformPromoData(promoData: RawFileContent[]): TransformedShufersalItem[] {
        if (!promoData || !Array.isArray(promoData) || promoData.length === 0) {
            this.logger.warn('No promotion data to transform');
            return [];
        }

        this.logger.log(`Transforming ${promoData.length} promotion data rows`);
        // For now, reuse the same transformation logic
        // This can be customized in the future if promotion data needs different handling
        return this.transformItems(promoData);
    }

    /**
     * Transform store data into structured format
     * @param storeData Raw store data from the API
     * @returns Transformed store items
     */
    transformStoreData(storeData: RawFileContent[]): TransformedShufersalItem[] {
        if (!storeData || !Array.isArray(storeData) || storeData.length === 0) {
            this.logger.warn('No store data to transform');
            return [];
        }

        this.logger.log(`Transforming ${storeData.length} store data rows`);
        // For now, reuse the same transformation logic
        // This can be customized in the future if store data needs different handling
        return this.transformItems(storeData);
    }

    /**
     * Map a validated price row to the output format
     */
    private mapPriceItemToOutputFormat(row: RawFileContent): TransformedShufersalItem {
        const content = row.row_content;

        return {
            chainid: String(content.chainid || ''),
            storeid: String(content.storeid || ''),
            itemcode: String(content.itemcode || ''),
            itemname: String(content.itemname || ''),
            itemprice: content.itemprice ? parseFloat(String(content.itemprice)) : null,
            rawItem: {
                ...content
            }
        };
    }
}
