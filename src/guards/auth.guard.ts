import { Request } from 'express'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../modules/shared/prisma.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException("Token not found in request's header")
    }

    try {
      const payload = this.jwt.verify(token) as { sub: string }
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      delete user.password

      request['user'] = user
    } catch (e) {
      throw new UnauthorizedException(e.message ?? 'Invalid token')
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
