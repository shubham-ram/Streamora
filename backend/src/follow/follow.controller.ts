import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post('follow')
  @UseGuards(JwtAuthGuard)
  async follow(
    @CurrentUser() user: User,
    @Body('targetUserId') targetUserId: string,
  ) {
    return this.followService.follow(user.id, targetUserId);
  }

  @Post('unfollow')
  @UseGuards(JwtAuthGuard)
  unfollow(
    @CurrentUser() user: User,
    @Body('targetUserId') targetUserId: string,
  ) {
    return this.followService.unfollow(user.id, targetUserId);
  }

  @Get('streams')
  @UseGuards(JwtAuthGuard)
  getFollowingLiveStreams(@CurrentUser() user: User) {
    return this.followService.getFollowingLiveStreams(user.id);
  }
  @Get('following')
  @UseGuards(JwtAuthGuard)
  getFollowing(@CurrentUser() user: User) {
    return this.followService.getFollowing(user.id);
  }
}
