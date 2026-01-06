import { Injectable, NotFoundException } from '@nestjs/common';
import { createStreamDto } from './dto/createStream.dto';
import { PrismaService } from 'src/prisma';

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

    await this.prisma.stream.create({
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

  //   async updateStream(streamId: string, updateStreamPayload: update) {}
}
