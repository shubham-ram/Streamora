import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        isLive: true,
        createdAt: true,
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      followersCount: user._count.followers,
      followingCount: user._count.following,
    };
  }

  async getPublicProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        isLive: true,
        createdAt: true,
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      followersCount: user._count.followers,
      followingCount: user._count.following,
    };
  }

  async updateProfile(userId: string, updateProfilePayload: UpdateProfileDto) {
    const updatedProfileInfo = await this.prisma.user.update({
      where: { id: userId },
      data: updateProfilePayload,
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
      },
    });

    return updatedProfileInfo;
  }

  async getStreamKey(userId: string): Promise<{ streamKey: string }> {
    const userStreamKey = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        streamKey: true,
      },
    });

    if (!userStreamKey) {
      throw new NotFoundException('Stream key not found');
    }

    return userStreamKey;
  }

  async regenerateStreamKey(userId: string): Promise<{ streamKey: string }> {
    const newKey = randomUUID();

    await this.prisma.user.update({
      where: { id: userId },
      data: { streamKey: newKey },
    });

    return { streamKey: newKey };
  }
}
