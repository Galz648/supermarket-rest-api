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
  @ApiOperation({ summary: 'Get all stores with optional filters' })
  @ApiResponse({ status: 200, description: 'Return filtered stores.' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter stores by city' })
  @ApiQuery({ name: 'chain', required: false, description: 'Filter stores by chain name' })
  findAll(
    @Query('city') city?: string,
    @Query('chain') chain?: string
  ) {
    return this.storesService.findAll(city, chain);
  }

  @Get('chains')
  @ApiOperation({ summary: 'Get all available chains' })
  @ApiResponse({ status: 200, description: 'Return all available chains.' })
  getAllChains() {
    return this.storesService.getAllChains();
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get all available cities' })
  @ApiResponse({ status: 200, description: 'Return all available cities.' })
  getAllCities() {
    return this.storesService.getAllCities();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a store by id' })
  @ApiParam({ name: 'id', description: 'ID of the store' })
  @ApiResponse({ status: 200, description: 'Return the store.' })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Get('chain/:chainName')
  @ApiOperation({ summary: 'Get stores by chain name' })
  @ApiParam({ name: 'chainName', description: 'Name of the chain' })
  @ApiResponse({ status: 200, description: 'Return stores for the specified chain.' })
  @ApiResponse({ status: 404, description: 'Chain not found.' })
  findByChain(@Param('chainName') chainName: string) {
    return this.storesService.findByChain(chainName);
  }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get a store by id' })
  // @ApiParam({ name: 'id', description: 'ID of the store' })
  // @ApiResponse({ status: 200, description: 'Return the store.' })
  // @ApiResponse({ status: 404, description: 'Store not found.' })
  // findOne(@Param('id') id: string) {
  //   return this.storesService.findOne(id);
  // }

  // @Get(':id/prices')
  // @ApiOperation({ summary: 'Get all prices for items in a specific store' })
  // @ApiParam({ name: 'id', description: 'ID of the store' })
  // @ApiResponse({ status: 200, description: 'Return prices for items in the store.' })
  // @ApiResponse({ status: 404, description: 'Store not found.' })
  // getStoreItemPrices(@Param('id') id: string) {
  //   return this.storesService.getStoreItemPrices(id);
  // }

  @Get('city/:city')
  @ApiOperation({ summary: 'Get stores by city' })
  @ApiParam({ name: 'city', description: 'City name' })
  @ApiResponse({ status: 200, description: 'Return stores for the specified city.' })
  @ApiResponse({ status: 404, description: 'City not found.' })
  getStoreByCity(@Param('city') city: string, @Query('chain') chainName: string) {
    return this.storesService.findByCity(city, chainName);
  }
}
