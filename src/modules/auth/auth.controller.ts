import { Controller, Post, HttpStatus, HttpCode, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto)
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto)
  }
}
