import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  async validate({ sub }: { sub: string }) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: sub } });

      if (!user) {
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }
}
