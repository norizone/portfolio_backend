import { IsInt } from 'class-validator';

export class UpdateWorkOrderDto {
  @IsInt()
  id: number;

  @IsInt()
  order: number;
}
