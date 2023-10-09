import { IsOptional, IsString } from 'class-validator';

export class BasePaginationDto {
  @IsString()
  @IsOptional()
  page: string;

  @IsString()
  @IsOptional()
  limit: string;
}
