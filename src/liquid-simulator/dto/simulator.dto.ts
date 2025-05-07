import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
  IsIn,
  IsOptional,
} from 'class-validator';
import { In } from 'typeorm';

export class SymbolConfigDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  symbol: string;

  @ApiProperty()
  @IsInt()
  contractSize: number;
}

export class SimulatorDto {
  @ApiProperty()
  threshold: number;

  @ApiProperty()
  feeRate: number;

  @ApiProperty({
    description: 'Date in iso format (yyyy-mm-dd)',
  })
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @ApiProperty({
    description: 'Date in iso format (yyyy-mm-dd)',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  usdPosition: 'base' | 'quote' | 'exchange';

  @ApiProperty()
  exchangePrice: number;

  @ApiProperty()
  spread: number;
}

export class StepSimulatorDto {
  @ApiProperty()
  startThreshold: number;

  @ApiProperty()
  endThreshold: number;

  @ApiProperty()
  step: number;

  @ApiProperty()
  feeRate: number;

  @ApiProperty({
    description: 'Date in iso format (yyyy-mm-dd)',
  })
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @ApiProperty({
    description: 'Date in iso format (yyyy-mm-dd)',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  usdPosition: 'base' | 'quote' | 'exchange';

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  exchangePrice: number;

  @ApiProperty()
  spread: number;
}

export class GetFileResultDto {
  @ApiProperty()
  fileName: string;
}
