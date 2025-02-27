import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ description: 'Item name', example: 'Milk 3%' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Item category', example: 'Dairy' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Brand name', example: 'Tnuva' })
  @IsString()
  brand: string;

  @ApiProperty({ description: 'Unit of measurement', example: 'liter' })
  @IsString()
  unit: string;
} 
