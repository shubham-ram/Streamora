import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { StreamsModule } from './streams/streams.module';
import { MediaModule } from './media/media.module';

/**
 * AppModule - Root Module of the Application
 *
 * KEY CONCEPTS FOR LEARNING:
 *
 * This is the "root" module - the starting point of our NestJS app.
 * Think of it like the trunk of a tree, with all other modules as branches.
 *
 * imports: [PrismaModule] - We import PrismaModule here so the entire app
 * has access to the database. Since PrismaModule is marked as @Global(),
 * we only need to import it once here.
 *
 * As we build more features, we'll add more modules:
 * - AuthModule (user authentication)
 * - UsersModule (user profiles)
 * - StreamsModule (live streams)
 * - ChatModule (real-time chat)
 * etc.
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    StreamsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
