import { IsString, IsNumber, IsObject, ValidateNested, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CoordinatesDto {
  @ApiProperty({ description: 'Latitude coordinate', example: 32.0853 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate', example: 34.7818 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

class OperatingHoursDto {
  @ApiProperty({ description: 'Opening time (HH:MM)', example: '08:00' })
  @IsString()
  open: string;

  @ApiProperty({ description: 'Closing time (HH:MM)', example: '22:00' })
  @IsString()
  close: string;
}

export class CreateSupermarketDto {
  @ApiProperty({ description: 'Supermarket name', example: 'Super-Sal Dizengoff' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Supermarket chain', example: 'Super-Sal' })
  @IsString()
  chain: string;

  @ApiProperty({ description: 'Street address', example: 'Dizengoff St 50' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'City', example: 'Tel Aviv' })
  @IsString()
  city: string;

  @ApiProperty({ 
    description: 'Geographic coordinates',
    type: CoordinatesDto
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiProperty({ 
    description: 'Operating hours by day of week (0-6, Sunday-Saturday)',
    example: {
      '0': { open: '08:00', close: '22:00' },
      '1': { open: '08:00', close: '22:00' }
    },
    type: 'object',
    additionalProperties: { type: 'object', $ref: '#/components/schemas/OperatingHoursDto' }
  })
  @IsObject()
  @IsOptional()
  operatingHours?: Record<string, OperatingHoursDto>;
} 
