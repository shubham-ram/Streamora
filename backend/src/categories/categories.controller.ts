import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from 'zod.validation.pipe';
import {
  createCategorySchema,
  type CreateCatergoryDto,
} from './dto/createCategory';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type User } from '@prisma/client';
import { CategoriesService } from './categories.service';

@Controller('/api/categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':slug')
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoryService.getCategoryBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createCategory(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createCategorySchema))
    createCategoryPayload: CreateCatergoryDto,
  ) {
    return this.categoryService.createCategory(createCategoryPayload, user.id);
  }
}
