import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
