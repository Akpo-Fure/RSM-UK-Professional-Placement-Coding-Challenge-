import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { IsEqualToProperty } from '../../utils/validation'

class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsString()
  @IsNotEmpty()
  @IsEqualToProperty('password')
  confirmPassword: string
}

class SignInDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export { SignUpDto, SignInDto }
