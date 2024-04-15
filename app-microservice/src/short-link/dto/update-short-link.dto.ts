import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateShortLinkDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  targetLink?: string;
}
