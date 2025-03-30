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
  @ApiQuery({ name: 'cities', required: false, description: 'Filter stores by cities (comma-separated)' })
  @ApiQuery({ name: 'chains', required: false, description: 'Filter stores by chains (comma-separated)' })
  findAll(
    @Query('cities') cities?: string,
    @Query('chains') chains?: string
  ) {
    const cityArray = cities?.split(',').map(city => city.trim());
    const chainArray = chains?.split(',').map(chain => chain.trim());
    return this.storesService.findAll(cityArray, chainArray);
  }

  @Get('by-chain/:chainName')
  @ApiOperation({ summary: 'Get all stores for a specific chain' })
  @ApiParam({ name: 'chainName', description: 'Name of the chain' })
  @ApiResponse({ status: 200, description: 'Return all stores for the specified chain.' })
  @ApiResponse({ status: 404, description: 'Chain not found.' })
  findByChain(@Param('chainName') chainName: string) {
    return this.storesService.findByChain(chainName);
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
}
