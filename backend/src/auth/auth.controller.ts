import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'zod.validation.pipe';
import { type LoginDto, loginSchema } from './dto/login.dto';
import { type RegisterDto, registerSchema } from './dto/register.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  registerUser(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  loginUser(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @Get('currentUser')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: User | null) {
    return user;
  }
}
