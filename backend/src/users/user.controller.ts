import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'zod.validation.pipe';
import { UserService } from './user.service';
import {
  updateProfileSchema,
  type UpdateProfileDto,
} from './dto/updateProfile.dto';
import {
  changePasswordSchema,
  type ChangePasswordDto,
} from './dto/changePassword.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@CurrentUser() user: User) {
    return this.userService.getUserProfile(user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(updateProfileSchema))
    updateProfilePayload: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.id, updateProfilePayload);
  }

  @Get('stream-key')
  @UseGuards(JwtAuthGuard)
  getStreamKey(@CurrentUser() user: User) {
    return this.userService.getStreamKey(user.id);
  }

  @Post('stream-key')
  @UseGuards(JwtAuthGuard)
  updateStreamKey(@CurrentUser() user: User) {
    return this.userService.regenerateStreamKey(user.id);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(changePasswordSchema))
    changePasswordPayload: ChangePasswordDto,
  ) {
    return this.userService.changePassword(
      user.id,
      changePasswordPayload.currentPassword,
      changePasswordPayload.newPassword,
    );
  }

  @Get(':username')
  getProfile(@Param('username') username: string) {
    return this.userService.getPublicProfile(username);
  }
}
