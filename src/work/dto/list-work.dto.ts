import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetWorkList {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  page: number;
  limit: number;
}
