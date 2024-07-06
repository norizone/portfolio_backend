import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class WorksList {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  pageSize: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  page: number;
}
