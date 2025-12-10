import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule - Database Module
 *
 * KEY CONCEPTS FOR LEARNING:
 *
 * 1. @Global() - This decorator makes the module available EVERYWHERE in the app
 *    without needing to import it in every other module. Since we need database
 *    access in almost every feature (users, streams, chat, etc.), making it
 *    global saves us from repetitive imports.
 *
 * 2. @Module() - This decorator defines a NestJS module. Modules are the
 *    building blocks of NestJS apps. They organize related code together.
 *
 * 3. providers: [PrismaService] - This tells NestJS: "Create an instance of
 *    PrismaService and manage it". NestJS will create a SINGLE instance
 *    (singleton) and reuse it everywhere.
 *
 * 4. exports: [PrismaService] - This allows other modules to USE the
 *    PrismaService. Without this, only THIS module could access it.
 *
 * HOW TO USE IN OTHER SERVICES:
 *
 * @Injectable()
 * export class UserService {
 *   constructor(private prisma: PrismaService) {}
 *
 *   findAll() {
 *     return this.prisma.user.findMany();
 *   }
 * }
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
