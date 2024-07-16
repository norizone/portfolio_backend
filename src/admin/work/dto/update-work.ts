import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsOptional,
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
}

export class UpdateWorkDto {
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
  comment?: string;

  @IsOptional()
  @IsString()
  url?: string | null;

  @IsOptional()
  @IsString()
  gitUrl?: string | null;

  @IsString()
  @IsNotEmpty()
  singleImgMain: string;

  @IsString()
  @IsNotEmpty()
  singleImgSub: string;

  @IsOptional()
  @IsString()
  singleImgSub2?: string | null;

  @ValidateNested({ each: true })
  @Type(() => ToolDto)
  @ArrayMinSize(1)
  useTools: ToolDto[];
}
