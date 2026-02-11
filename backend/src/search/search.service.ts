import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchUser(searchTerm: string) {
    return this.prisma.user.findMany({
      where: {
        username: { contains: searchTerm, mode: 'insensitive' },
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        isLive: true,
      },
      take: 10,
    });
  }

  async searchCategory(searchTerm: string) {
    return this.prisma.category.findMany({
      where: {
        name: { contains: searchTerm, mode: 'insensitive' },
      },
      take: 10,
    });
  }

  async searchStream(searchTerm: string) {
    return this.prisma.stream.findMany({
      where: {
        title: { contains: searchTerm, mode: 'insensitive' },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        category: { select: { id: true, name: true, slug: true } },
      },
      take: 10,
    });
  }

  async search(query: string) {
    if (!query || query.trim().length < 2) {
      return { streams: [], users: [], categories: [] };
    }

    const searchTerm: string = query.trim();

    const [streams, users, categories] = await Promise.allSettled([
      this.searchStream(searchTerm),
      this.searchUser(searchTerm),
      this.searchCategory(searchTerm),
    ]);

    const searchOutput = {
      streams: streams.status === 'fulfilled' ? streams.value : [],
      users: users.status === 'fulfilled' ? users.value : [],
      categories: categories.status === 'fulfilled' ? categories.value : [],
    };

    return searchOutput;
  }
}
