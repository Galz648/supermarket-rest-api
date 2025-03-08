import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChainsService } from './chains.service.js';
import { AdminGuard } from '../guards/admin.guard.js';

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

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new chain' })
  @ApiResponse({ status: 201, description: 'The chain has been successfully created.' })
  create(@Body() createChainDto: { name: string }) {
    return this.chainsService.createChain(createChainDto);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a chain' })
  @ApiResponse({ status: 200, description: 'The chain has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Chain not found.' })
  update(@Param('id') id: string, @Body() updateChainDto: { name?: string }) {
    return this.chainsService.updateChain(id, updateChainDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a chain' })
  @ApiResponse({ status: 204, description: 'The chain has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Chain not found.' })
  async remove(@Param('id') id: string) {
    await this.chainsService.deleteChain(id);
    return;
  }
} 
