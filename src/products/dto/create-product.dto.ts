import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nom: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  prix: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsInt()
  @Min(1)
  categoryId: number;
}