import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async follow(userId: string, targetUserId: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Not found');
    }

    if (userId === targetUserId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Already following this user');
    }

    return this.prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
    });
  }

  async unfollow(userId: string, targetUserId: string) {
    return this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });
  }

  async getFollowingLiveStreams(userId: string) {
    const followingList = await this.prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingUserIdList = followingList.map(
      (following) => following.followingId,
    );

    const followLiveStream = await this.prisma.stream.findMany({
      where: {
        userId: { in: followingUserIdList },
        isLive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        viewerCount: 'desc',
      },
    });

    return followLiveStream;
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            isLive: true,
          },
        },
      },
    });
  }
}
