import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
} 
