import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createStreamDto } from './dto/createStream.dto';
import { UpdateStreamDto } from './dto/updateStream.dto';
import { PrismaService } from 'src/prisma';
import { type User } from '@prisma/client';

@Injectable()
export class StreamsService {
  constructor(private prisma: PrismaService) {}

  async createStream(userId: string, createStreamPayload: createStreamDto) {
    await this.prisma.stream.updateMany({
      where: { userId, isLive: true },
      data: { isLive: false, endedAt: new Date() },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { isLive: true },
    });

    return this.prisma.stream.create({
      data: {
        userId,
        title: createStreamPayload.title,
        description: createStreamPayload.description ?? null,
        categoryId: createStreamPayload.categoryId ?? null,
        isLive: true,
      },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async getAllLiveStream() {
    return this.prisma.stream.findMany({
      where: { isLive: true },
      orderBy: { startedAt: 'asc' },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async getLiveStream(streamId: string) {
    const stream = await this.prisma.stream.findFirst({
      where: { id: streamId },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true, bio: true },
        },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }
    return stream;
  }

  async updateStream(
    streamId: string,
    userId: string,
    updateStreamPayload: UpdateStreamDto,
  ) {
    const stream = await this.prisma.stream.findUnique({
      where: {
        id: streamId,
      },
    });

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    if (userId !== stream.userId) {
      throw new ForbiddenException('Not your stream');
    }

    return this.prisma.stream.update({
      where: { id: streamId },
      data: updateStreamPayload,
    });
  }

  async getUserStream(username: string) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.prisma.stream.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async getLiveStreamByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) throw new NotFoundException('User not found');

    const stream = await this.prisma.stream.findFirst({
      where: { userId: user.id, isLive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!stream) throw new NotFoundException('User is not live');

    return {
      ...stream,
      hlsUrl: `http://localhost:8888/live/${user.streamKey}/index.m3u8`,
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async endStream(id: string, userId: string) {
    const stream = await this.prisma.stream.findUnique({ where: { id } });

    if (!stream) throw new NotFoundException('Stream not found');

    if (stream.userId !== userId) {
      throw new ForbiddenException('Not your stream');
    }

    await this.prisma.stream.update({
      where: { id },
      data: { isLive: false, endedAt: new Date() },
    });
    // Update user status
    await this.prisma.user.update({
      where: { id: userId },
      data: { isLive: false },
    });
    return { message: 'Stream ended' };
  }

  async endAllStream(userId: string) {
    await this.prisma.stream.updateMany({
      where: { userId, isLive: true },
      data: { isLive: false, endedAt: new Date() },
    });

    // Update user status
    await this.prisma.user.update({
      where: { id: userId },
      data: { isLive: false },
    });
  }
}
