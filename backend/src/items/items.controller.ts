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

  @Get()
  @ApiOperation({ summary: 'Get all items with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated items with metadata',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/Item' } },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' }
          }
        }
      }
    }
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.itemsService.findAll(page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search items by name, brand, or category' })
  @ApiQuery({ name: 'query', required: true, description: 'Search query string' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of results (default: 20)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'brand', required: false, description: 'Filter by brand' })
  @ApiResponse({ status: 200, description: 'Returns matching items' })
  async search(
    @Query('query') query: string,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
  ): Promise<Item[]> {
    return this.itemsService.search(query, limit, category, brand);
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'Get item by barcode' })
  @ApiParam({ name: 'barcode', description: 'Item barcode' })
  @ApiResponse({ status: 200, description: 'Returns the item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findByBarcode(@Param('barcode') barcode: string): Promise<Item> {
    return this.itemsService.findByBarcode(barcode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Returns the item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }
} 
