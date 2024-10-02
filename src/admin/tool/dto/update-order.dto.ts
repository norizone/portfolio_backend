import { IsInt } from 'class-validator';

export class UpdateToolOrderDto {
  @IsInt()
  id: number;

  @IsInt()
  order: number;
}
