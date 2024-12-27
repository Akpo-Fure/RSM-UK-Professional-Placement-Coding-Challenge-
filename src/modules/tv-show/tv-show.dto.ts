import {
  IsString,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  MinLength,
  Min,
  Max,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { UUID } from 'crypto'
import { Genre } from '@prisma/client'
import { IsSeasonNumbersUnique } from '../utils/validation'

class CreateTvShowDto {
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

export {
  CreateTvShowDto,
  AddSeasonToTVShowDto,
  TvShowIdParamDto,
  RateTvShowDto,
}
