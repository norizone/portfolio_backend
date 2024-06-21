// import { Transform } from 'class-transformer';
import {
  IsEmail,
  // IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  // // @Transform(({ value }) => parseInt(value))
  // @IsInt()
  // @IsNotEmpty()
  // permission: number;
}
