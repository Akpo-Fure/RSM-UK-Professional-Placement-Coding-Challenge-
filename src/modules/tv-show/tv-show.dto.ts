import {
  IsString,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  MinLength,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'
import { UUID } from 'crypto'
import { Genre } from '@prisma/client'
import { IsSeasonNumbersUnique } from '../utils/validation'

class AddTvShowDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  streamingServiceId: UUID

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string

  @IsEnum(Genre)
  @IsNotEmpty()
  genre: Genre

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number

  @ValidateNested({ each: true })
  @IsSeasonNumbersUnique('seasons')
  @IsArray()
  @Type(() => AddSeasonDto)
  seasons: AddSeasonDto[]
}

class AddSeasonDto {
  @IsNumber()
  @Min(1)
  number: number

  @IsNumber()
  @Min(1888)
  @Max(new Date().getFullYear())
  year: number

  @IsNumber()
  @Min(1)
  noOfEpisodes: number
}

class AddSeasonToTVShowDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  tvShowId: UUID

  @ValidateNested({ each: true })
  @IsSeasonNumbersUnique('seasons')
  @IsArray()
  @Type(() => AddSeasonDto)
  seasons: AddSeasonDto[]
}

class TvShowIdParamDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: UUID
}

class RateTvShowDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number
}

class GetTvShowsOnServiceQueryDto {
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
}

class AddTvShowToServiceDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  streamingServiceId: UUID

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  tvShowId: UUID
}

class AddSeasonToTvShowDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  tvShowId: UUID

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  streamingServiceId: UUID

  @Type(() => AddSeasonDto)
  @ValidateNested()
  @IsNotEmpty()
  season: AddSeasonDto
}

export {
  AddTvShowDto,
  AddSeasonToTVShowDto,
  TvShowIdParamDto,
  RateTvShowDto,
  AddTvShowToServiceDto,
  AddSeasonToTvShowDto,
  GetTvShowsOnServiceQueryDto,
}
