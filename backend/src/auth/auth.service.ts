import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerUserPayload: RegisterDto) {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: registerUserPayload.email,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(
        registerUserPayload.password,
        10,
      );

      const user = this.prisma.user.create({
        data: {
          username: registerUserPayload.username,
          email: registerUserPayload.email,
          passwordHash: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async loginUser(loginUserPayload: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: loginUserPayload.email,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        loginUserPayload.password,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      const accessToken = await this.generateToken(user);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async generateToken(user: any) {
    try {
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
      };

      const token = this.jwtService.sign(payload);

      return token;
    } catch (error) {
      throw error;
    }
  }
}
