import {
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

export { CreateStreamingServiceDto }
