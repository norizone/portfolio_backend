import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateToolDto {
  @IsString()
  @IsNotEmpty()
  toolName: string;
}
