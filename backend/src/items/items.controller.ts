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
  @ApiResponse({ status: 200, description: 'Returns matching items' })
  async search(
    @Query('query') query: string,
  ): Promise<Item[]> {
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
  @ApiParam({ name: 'chainName', description: 'Chain name' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Returns the price information' })
  @ApiResponse({ status: 404, description: 'Price not found' })
  async getPriceByStoreIdAndItemId(@Param('chainName') chainName: string, @Param('storeId') storeId: string, @Param('itemId') itemId: string) {
    return this.itemsService.getPriceByStoreIdAndItemId(chainName, storeId, itemId);
  }
}


