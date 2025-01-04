import { Prisma } from '@prisma/client'
import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator'
import { Currency } from '@prisma/client'

class CreateStreamingServiceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number

  @IsEnum(Currency)
  @IsOptional()
  currency: Currency = Currency.GBP
}

class GetStreamingServicesQueryDto {
  @IsString()
  @IsOptional()
  page: number

  @IsString()
  @IsOptional()
  limit: number

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  sort: Prisma.SortOrder = Prisma.SortOrder.asc

  @IsEnum(Prisma.StreamingServiceScalarFieldEnum)
  @IsOptional()
  sortBy: Prisma.StreamingServiceScalarFieldEnum =
    Prisma.StreamingServiceScalarFieldEnum.createdAt

  @IsString()
  @IsOptional()
  search: string
}

class DeleteStreamingServiceParamsDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string
}

export {
  CreateStreamingServiceDto,
  GetStreamingServicesQueryDto,
  DeleteStreamingServiceParamsDto,
}
