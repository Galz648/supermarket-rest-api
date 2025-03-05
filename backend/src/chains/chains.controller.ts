import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChainsService } from './chains.service.js';

@ApiTags('chains')
@Controller('chains')
export class ChainsController {
  constructor(private chainsService: ChainsService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all chains' })
  @ApiResponse({ status: 200, description: 'Return all chains.' })
  findAll() {
    return this.chainsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chain by id' })
  @ApiResponse({ status: 200, description: 'Return the chain.' })
  @ApiResponse({ status: 404, description: 'Chain not found.' })
  findOne(@Param('id') id: string) {
    return this.chainsService.findOne(id);
  }

  @Get(':id/stores')
  @ApiOperation({ summary: 'Get stores for a specific chain' })
  @ApiResponse({ status: 200, description: 'Return stores for the chain.' })
  @ApiResponse({ status: 404, description: 'Chain not found.' })
  async findStores(@Param('id') id: string) {
    const chain = await this.chainsService.findOne(id);
    return chain.stores;
  }
} 
