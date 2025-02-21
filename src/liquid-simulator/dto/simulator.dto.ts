import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsInt } from 'class-validator';

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
    type: SymbolConfigDto,
    isArray: true,
  })
  symbols: SymbolConfigDto[];
}
