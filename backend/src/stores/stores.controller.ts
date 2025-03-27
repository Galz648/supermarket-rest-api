import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StoresService } from './stores.service.js';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) { }

  @Get()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({ status: 200, description: 'Return all stores.' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter stores by city' })
  findAll(@Query('city') city?: string) {
    if (city) {
      return this.storesService.findByCity(city);
    }
    return this.storesService.findAll();
  }

  @Get('chain/:chainName')
  @ApiOperation({ summary: 'Get stores by chain name' })
  @ApiParam({ name: 'chainName', description: 'Name of the chain' })
  @ApiResponse({ status: 200, description: 'Return stores for the specified chain.' })
  @ApiResponse({ status: 404, description: 'Chain not found.' })
  findByChain(@Param('chainName') chainName: string) {
    return this.storesService.findByChain(chainName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a store by id' })
  @ApiParam({ name: 'id', description: 'ID of the store' })
  @ApiResponse({ status: 200, description: 'Return the store.' })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Get(':id/prices')
  @ApiOperation({ summary: 'Get all prices for items in a specific store' })
  @ApiParam({ name: 'id', description: 'ID of the store' })
  @ApiResponse({ status: 200, description: 'Return prices for items in the store.' })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  getStoreItemPrices(@Param('id') id: string) {
    return this.storesService.getStoreItemPrices(id);
  }
}
