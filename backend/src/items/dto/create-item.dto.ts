import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ description: 'Item name', example: 'Milk 3%' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Item category', example: 'Dairy' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Manufacturer name', example: 'Tnuva' })
  @IsString()
  manufacturer: string;

  @ApiProperty({ description: 'Base price in NIS', example: 5.9 })
  @IsNumber()
  @IsPositive()
  basePrice: number;

  @ApiProperty({ description: 'Unit of measurement', example: 'liter' })
  @IsString()
  unit: string;
} 
