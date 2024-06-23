import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class UpdateToolDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  toolName: string;
}

export class UpdateToolsDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateToolDto)
  @ArrayMinSize(1)
  tools: UpdateToolDto[];
}
