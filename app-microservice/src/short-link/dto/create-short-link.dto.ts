import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShortLinkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetLink: string;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
