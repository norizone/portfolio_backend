import { IsNotEmpty, IsString } from 'class-validator';

export class CreateToolDto {
  @IsString()
  @IsNotEmpty()
  toolName: string;
}
