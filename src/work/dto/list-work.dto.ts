import { IsInt, IsNotEmpty } from 'class-validator';

export class GetWorkList {
  @IsInt()
  @IsNotEmpty()
  page: number;
  limit: number;
}
