import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetProductsFilterDto {
  @IsOptional()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  category: string;
}
