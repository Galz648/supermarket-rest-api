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
  @ApiQuery({ name: 'chainObjectId', required: false, description: 'Filter stores by chain ObjectId' })
  findAll(
    @Query('city') city?: string,
    @Query('chainObjectId') chainObjectId?: string
  ) {
    return this.storesService.findAll(city, chainObjectId);
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
  @ApiParam({ name: 'id', description: 'Store ObjectId' })
  @ApiResponse({ status: 200, description: 'Return the store.' })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Get('chain/:chainId')
  @ApiOperation({ summary: 'Get all stores for a specific chain' })
  @ApiParam({ name: 'chainId', description: 'Chain ObjectId' })
  @ApiResponse({ status: 200, description: 'Return stores for the chain.' })
  findByChain(@Param('chainId') chainId: string) {
    return this.storesService.findByChain(chainId);
  }

  @Get('city/:city')
  @ApiOperation({ summary: 'Get all stores in a specific city' })
  @ApiParam({ name: 'city', description: 'City name' })
  @ApiQuery({ name: 'chainObjectId', required: false, description: 'Filter by chain ObjectId' })
  @ApiResponse({ status: 200, description: 'Return stores in the city.' })
  getStoreByCity(@Param('city') city: string, @Query('chainObjectId') chainObjectId: string) {
    return this.storesService.findByCity(city, chainObjectId);
  }
}
