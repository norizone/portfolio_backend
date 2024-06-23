import { Transform } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';
export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  permission: number;
}
