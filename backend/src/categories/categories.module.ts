import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesModule],
  providers: [CategoriesService],
})
export class CategoriesModule {}
