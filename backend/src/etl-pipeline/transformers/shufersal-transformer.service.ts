import { Injectable, Logger } from '@nestjs/common';
import { RawFileContent } from '../data-access.service.js';
import { ShufersalItem, ShufersalStore, ShufersalStoreSchema } from '../schemas/shufersal-schema.js';


/**
 * Service that transforms raw Shufersal data into structured formats.
 * This includes functionality for prices, promotions, and store information.
 */
@Injectable()
export class ShufersalTransformerService {
    private readonly logger = new Logger(ShufersalTransformerService.name);

    /**
     * Generic method to transform any type of item data into structured objects
     * This provides flexibility for different file types and use cases
     * 
     * @param itemData Raw item data from the API
     * @param mapFunction Optional custom mapping function
     * @returns Array of transformed items
     */
    transformItems<T extends ShufersalItem | ShufersalStore>(
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
                // Use custom mapping function if provided, otherwise default to price mapping
                // TODO: improve this type inference
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

    transformStoreData(storeData: RawFileContent[]): ShufersalStore[] {
        if (!storeData || !Array.isArray(storeData) || storeData.length === 0) {
            this.logger.warn('No store data to transform');
            return [];
        }

        this.logger.log(`Transforming ${storeData.length} store data rows`);
        // For now, reuse the same transformation logic
        // This can be customized in the future if store data needs different handling
        return this.transformItems(storeData, (row) => ShufersalStoreSchema.parse(row));
    }

    /**
     * Map a validated price row to the output format
     */
    // private mapPriceItemToOutputFormat(row: RawFileContent): ShufersalItem {
    //     const content = row.row_content;

    //     return {
    //         chainid: String(content.chainid || ''),
    //         storeid: String(content.storeid || ''),
    //         itemcode: String(content.itemcode || ''),
    //         itemname: String(content.itemname || ''),
    //         itemprice: content.itemprice ? parseFloat(String(content.itemprice)) : null,
    //         rawItem: {
    //             ...content
    //         }
    //     };
    // }
}
