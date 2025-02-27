import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SupermarketsService } from './supermarkets.service';
import { CreateSupermarketDto } from './dto/create-supermarket.dto';
import { UpdateSupermarketDto } from './dto/update-supermarket.dto';
import { FindNearbyDto } from './dto/find-nearby.dto';

@ApiTags('supermarkets')
@Controller('supermarkets')
export class SupermarketsController {
  constructor(private readonly supermarketsService: SupermarketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supermarket' })
  @ApiResponse({ status: 201, description: 'The supermarket has been successfully created.' })
  create(@Body() createSupermarketDto: CreateSupermarketDto) {
    return this.supermarketsService.create(createSupermarketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all supermarkets' })
  @ApiResponse({ status: 200, description: 'Return all supermarkets.' })
  findAll() {
    return this.supermarketsService.findAll();
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby supermarkets' })
  @ApiResponse({ status: 200, description: 'Return nearby supermarkets.' })
  findNearby(@Query() findNearbyDto: FindNearbyDto) {
    return this.supermarketsService.findNearby(findNearbyDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a supermarket by id' })
  @ApiParam({ name: 'id', description: 'Supermarket ID' })
  @ApiResponse({ status: 200, description: 'Return the supermarket.' })
  @ApiResponse({ status: 404, description: 'Supermarket not found.' })
  findOne(@Param('id') id: string) {
    return this.supermarketsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a supermarket' })
  @ApiParam({ name: 'id', description: 'Supermarket ID' })
  @ApiResponse({ status: 200, description: 'The supermarket has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Supermarket not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateSupermarketDto: UpdateSupermarketDto
  ) {
    return this.supermarketsService.update(id, updateSupermarketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supermarket' })
  @ApiParam({ name: 'id', description: 'Supermarket ID' })
  @ApiResponse({ status: 200, description: 'The supermarket has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Supermarket not found.' })
  remove(@Param('id') id: string) {
    return this.supermarketsService.remove(id);
  }
} 
