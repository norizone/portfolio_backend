import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// ToolDto を定義
export class ToolDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  toolName: string;
}

export class CreateWorkDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  order: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  permission: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  publication: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  archiveImg: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  singleImgMain: string;

  @IsString()
  @IsNotEmpty()
  singleImgSub: string;

  @IsString()
  comment?: string;

  @IsString()
  url?: string;

  @IsString()
  gitUrl?: string;

  @IsString()
  singleImgSub2?: string;

  @ValidateNested({ each: true })
  @Type(() => ToolDto)
  @ArrayMinSize(1)
  useTools: ToolDto[];
}
