import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ItemsService } from './items.service.js';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Return all items.' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for items' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Return matching items.' })
  search(@Query('q') query: string) {
    return this.itemsService.search(query);
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'Get an item by barcode' })
  @ApiParam({ name: 'barcode', description: 'Item Barcode' })
  @ApiResponse({ status: 200, description: 'Return the item.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  findByBarcode(@Param('barcode') barcode: string) {
    return this.itemsService.findByBarcode(barcode);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get items by name' })
  @ApiParam({ name: 'name', description: 'Item name' })
  @ApiResponse({ status: 200, description: 'Return items matching the name.' })
  findByName(@Param('name') name: string) {
    return this.itemsService.findByName(name);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get an item by id' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Return the item.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }
} 
