import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ItemsService } from './items.service.js';
import { Item } from '@prisma/client';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Get('search')
  @ApiOperation({ summary: 'Search items by name' })
  @ApiQuery({ name: 'query', required: true, description: 'Search query' })
  @ApiResponse({
    status: 200,
    description: 'Returns matching items with availability information',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Item ID' },
          itemCode: { type: 'string', description: 'Item barcode/code' },
          name: { type: 'string', description: 'Item name' },
          unit: { type: 'string', description: 'Unit of measurement' },
          category: { type: 'string', description: 'Category ID' },
          brand: { type: 'string', description: 'Brand name' },
          isAvailable: { type: 'boolean', description: 'Whether the item is available in any store' },
          availableStores: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                storeId: { type: 'string', description: 'Store ID' },
                storeName: { type: 'string', description: 'Store name' },
                city: { type: 'string', description: 'Store city' },
                price: { type: 'number', description: 'Item price' },
                currency: { type: 'string', description: 'Price currency' },
                lastUpdated: { type: 'string', description: 'Last price update timestamp' }
              }
            }
          }
        }
      }
    }
  })
  async search(
    @Query('query') query: string,
  ) {
    return this.itemsService.search(query);
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'Get item by barcode' })
  @ApiParam({ name: 'barcode', description: 'Item barcode' })
  @ApiResponse({ status: 200, description: 'Returns the item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findByBarcode(@Param('barcode') barcode: string): Promise<Item> {
    return this.itemsService.findByBarcode(barcode);
  }

  @Get('chain/:chainId/stores/:storeId/items/:itemId/price')
  @ApiOperation({ summary: 'Get price by store ID and item ID for a specific chain' })
  @ApiParam({ name: 'chainId', description: 'Chain ObjectId' })
  @ApiParam({ name: 'storeId', description: 'Store ObjectId' })
  @ApiParam({ name: 'itemId', description: 'Item ObjectId' })
  @ApiResponse({ status: 200, description: 'Returns the price information' })
  @ApiResponse({ status: 404, description: 'Price not found' })
  async getPriceByStoreIdAndItemId(
    @Param('chainId') chainId: string,
    @Param('storeId') storeId: string,
    @Param('itemId') itemId: string
  ) {
    return this.itemsService.getPriceByStoreIdAndItemId(chainId, storeId, itemId);
  }
}


