import {
  IsString,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  MinLength,
  Min,
  Max,
  IsOptional,
} from 'class-validator'
import { UUID } from 'crypto'
import { Genre, Prisma } from '@prisma/client'

class CreateFilmDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  streamingServiceId: UUID

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string

  @IsNumber()
  @Min(1888)
  @Max(new Date().getFullYear())
  year: number

  @IsEnum(Genre)
  @IsNotEmpty()
  genre: Genre

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  runtime: number
}

class FilmIdParamDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: UUID
}

class RateFilmDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number
}

class GetFilmsQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  streamingServiceId: UUID

  @IsString()
  @IsOptional()
  page: number

  @IsString()
  @IsOptional()
  limit: number

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  sort: Prisma.SortOrder = Prisma.SortOrder.desc

  @IsEnum(Prisma.FilmScalarFieldEnum)
  @IsOptional()
  sortBy: Prisma.FilmScalarFieldEnum = Prisma.FilmScalarFieldEnum.createdAt

  @IsString()
  @IsOptional()
  search: string
}

export { CreateFilmDto, FilmIdParamDto, RateFilmDto, GetFilmsQueryDto }
