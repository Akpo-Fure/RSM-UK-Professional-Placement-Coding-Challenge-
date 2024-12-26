import * as argon2 from 'argon2'
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { SignInDto, SignUpDto } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (user) {
      throw new NotAcceptableException('User already exists')
    }

    await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await argon2.hash(dto.password),
      },
    })

    return { message: 'Successfully signed up' }
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) {
      throw new NotFoundException('Invalid email or password')
    }

    if (!(await argon2.verify(user.password, dto.password))) {
      throw new NotAcceptableException('Invalid email or password')
    }

    delete user.password

    return {
      message: 'Successfully signed in',
      token: this.jwt.sign({ sub: user.id }),
      user,
    }
  }
}
