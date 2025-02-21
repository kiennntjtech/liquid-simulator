import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
