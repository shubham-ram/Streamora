import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateCatergoryDto } from './dto/createCategory';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async createCategory(
    createCategoryPayload: CreateCatergoryDto,
    userId: string,
  ) {
    const categoryName: string = createCategoryPayload.name;

    const categorySlug: string = this.generateSlug(categoryName);

    const existingCategory = await this.prisma.category.findFirst({
      where: { OR: [{ name: categoryName }, { slug: categorySlug }] },
    });

    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    const category = await this.prisma.category.create({
      data: {
        name: categoryName,
        slug: categorySlug,
        isOfficial: false,
        createdBy: userId,
      },
    });

    return category;
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      orderBy: [{ isOfficial: 'desc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        isOfficial: true,
        _count: { select: { streams: true } },
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        isOfficial: true,
        _count: { select: { streams: true } },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
