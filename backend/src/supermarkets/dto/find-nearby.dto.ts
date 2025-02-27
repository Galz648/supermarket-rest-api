import { IsNumber, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindNearbyDto {
  @ApiProperty({ description: 'Latitude coordinate', example: 32.0853 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  lat: number;

  @ApiProperty({ description: 'Longitude coordinate', example: 34.7818 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  lng: number;

  @ApiProperty({ description: 'Maximum distance in kilometers', example: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  radius?: number = 5;
} 
