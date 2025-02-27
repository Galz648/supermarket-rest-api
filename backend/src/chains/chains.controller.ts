import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChainsService } from './chains.service.js';

@ApiTags('chains')
@Controller('chains')
export class ChainsController {
  constructor(private readonly chainsService: ChainsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all chains' })
  @ApiResponse({ status: 200, description: 'Return all chains.' })
  findAll() {
    return this.chainsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chain by id' })
  @ApiParam({ name: 'id', description: 'Chain ID' })
  @ApiResponse({ status: 200, description: 'Return the chain.' })
  @ApiResponse({ status: 404, description: 'Chain not found.' })
  findOne(@Param('id') id: string) {
    return this.chainsService.findOne(id);
  }
} 
