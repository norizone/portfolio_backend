import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class WorksList {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  limit: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  page: number;
}
