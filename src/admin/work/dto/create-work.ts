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

export class CreateEditWorkDto {
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

  @IsOptional()
  @IsString()
  comment?: string | null;

  @IsOptional()
  @IsString()
  url?: string | null;

  @IsOptional()
  @IsInt()
  isLinkToUrl?: number | null;

  @IsOptional()
  @IsString()
  gitUrl?: string | null;

  @IsOptional()
  @IsString()
  singleImgMain: string;

  @IsOptional()
  @IsString()
  singleImgSub: string;

  @IsOptional()
  @IsString()
  singleImgSub2?: string | null;

  @ValidateNested({ each: true })
  @Type(() => ToolDto)
  @ArrayMinSize(1)
  useTools: ToolDto[];
}
